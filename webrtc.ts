/**
 * WebRTC Service for audio and video communication
 */

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  offerOptions?: RTCOfferOptions;
  answerOptions?: RTCAnswerOptions;
}

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  audioStream?: MediaStream;
  videoStream?: MediaStream;
}

export class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private config: WebRTCConfig;
  private signalingChannel: WebSocket | null = null;

  constructor(config?: Partial<WebRTCConfig>) {
    this.config = {
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["stun:stun1.l.google.com:19302"] },
      ],
      ...config,
    };
  }

  /**
   * Initialize local media stream (audio and/or video)
   */
  async initializeLocalStream(
    constraints: MediaStreamConstraints = { audio: true, video: false }
  ): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error("Failed to get user media:", error);
      throw error;
    }
  }

  /**
   * Stop local media stream
   */
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }

  /**
   * Create a new peer connection
   */
  createPeerConnection(peerId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.signalingChannel) {
        this.signalingChannel.send(
          JSON.stringify({
            type: "ice-candidate",
            peerId,
            candidate: event.candidate,
          })
        );
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log("Remote track received:", event.track.kind);
      // Emit event for UI to handle remote stream
      this.onRemoteTrack?.(peerId, event.streams[0]);
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, peerConnection.connectionState);
      if (peerConnection.connectionState === "failed") {
        this.closePeerConnection(peerId);
      }
    };

    // Store peer connection
    this.peerConnections.set(peerId, {
      peerId,
      connection: peerConnection,
    });

    return peerConnection;
  }

  /**
   * Create an offer for a peer
   */
  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId)?.connection;
    if (!peerConnection) {
      throw new Error(`Peer connection not found for ${peerId}`);
    }

    const offer = await peerConnection.createOffer(this.config.offerOptions);
    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  /**
   * Create an answer for a peer
   */
  async createAnswer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId)?.connection;
    if (!peerConnection) {
      throw new Error(`Peer connection not found for ${peerId}`);
    }

    const answer = await peerConnection.createAnswer(this.config.answerOptions);
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  /**
   * Set remote description (offer or answer)
   */
  async setRemoteDescription(
    peerId: string,
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId)?.connection;
    if (!peerConnection) {
      throw new Error(`Peer connection not found for ${peerId}`);
    }

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(description)
    );
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(
    peerId: string,
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId)?.connection;
    if (!peerConnection) {
      throw new Error(`Peer connection not found for ${peerId}`);
    }

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Failed to add ICE candidate:", error);
    }
  }

  /**
   * Close a peer connection
   */
  closePeerConnection(peerId: string): void {
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.connection.close();
      this.peerConnections.delete(peerId);
    }
  }

  /**
   * Close all peer connections
   */
  closeAllPeerConnections(): void {
    this.peerConnections.forEach((peer) => {
      peer.connection.close();
    });
    this.peerConnections.clear();
  }

  /**
   * Get peer connection
   */
  getPeerConnection(peerId: string): RTCPeerConnection | undefined {
    return this.peerConnections.get(peerId)?.connection;
  }

  /**
   * Get all peer connections
   */
  getAllPeerConnections(): Map<string, RTCPeerConnection> {
    const connections = new Map<string, RTCPeerConnection>();
    this.peerConnections.forEach((peer, peerId) => {
      connections.set(peerId, peer.connection);
    });
    return connections;
  }

  /**
   * Toggle audio track
   */
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * Toggle video track
   */
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * Get audio tracks
   */
  getAudioTracks(): MediaStreamTrack[] {
    return this.localStream?.getAudioTracks() || [];
  }

  /**
   * Get video tracks
   */
  getVideoTracks(): MediaStreamTrack[] {
    return this.localStream?.getVideoTracks() || [];
  }

  /**
   * Get connection stats
   */
  async getStats(peerId: string): Promise<RTCStatsReport | null> {
    const peerConnection = this.peerConnections.get(peerId)?.connection;
    if (!peerConnection) {
      return null;
    }

    return await peerConnection.getStats();
  }

  /**
   * Callbacks
   */
  onRemoteTrack?: (peerId: string, stream: MediaStream) => void;
  onConnectionStateChange?: (peerId: string, state: RTCPeerConnectionState) => void;
  onIceCandidate?: (peerId: string, candidate: RTCIceCandidate) => void;
}

// Export singleton instance
export const webrtcService = new WebRTCService();
