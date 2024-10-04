import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  MoreVertical,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ReactPlayer from "react-player";
import peerService, { peer } from "@/services/peer";
import { usePlaygroundContext } from "@/contexts/PlaygroundContext";

interface UserJoinedPayload {
  email: string;
  id: string;
}

interface CallOfferPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAcceptedPayload {
  from: string;
  ans: RTCSessionDescriptionInit;
}

interface NegoNeededPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface NegoFinalPayload {
  ans: RTCSessionDescriptionInit;
}

export default function VideoCall() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const { socket } = usePlaygroundContext();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const handleUserJoined = useCallback(({ email, id }: UserJoinedPayload) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    if (!remoteSocketId) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peerService.getOffer();
    socket?.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }: CallOfferPayload) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peerService.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer?.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }: CallAcceptedPayload) => {
      peerService.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    if (!remoteSocketId) return;

    const offer = await peerService.getOffer();
    socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer?.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }: NegoNeededPayload) => {
      const ans = await peerService.getAnswer(offer);
      socket?.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }: NegoFinalPayload) => {
    await peerService.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer?.addEventListener("track", (ev: RTCTrackEvent) => {
      const remoteStream = ev.streams[0];
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream);
    });
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => {
    sendStreams();
    setIsVideoOn(!isVideoOn);
  };
  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incomming:call", handleIncommingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:nego:needed", handleNegoNeedIncomming);
    socket?.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incomming:call", handleIncommingCall);
      socket?.off("call:accepted", handleCallAccepted);
      socket?.off("peer:nego:needed", handleNegoNeedIncomming);
      socket?.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <Card
      className={`bg-gray-100 dark:bg-gray-800 ${
        isExpanded ? "fixed inset-0 z-50" : "fixed bottom-4 right-4 w-80"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Video Call</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleExpand}>
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className={`relative ${
            isExpanded ? "h-[calc(100vh-12rem)]" : "h-40"
          } bg-gray-900 rounded-lg overflow-hidden mb-4`}
        >
          {remoteStream ? (
            <ReactPlayer
              url={remoteStream as MediaStream}
              playing
              muted
              height="100%"
              width="100%"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="User"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-50 px-2 py-1 rounded text-white text-sm">
            You
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={toggleVideo}>
              {isVideoOn ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleCallUser}>
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon">
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
