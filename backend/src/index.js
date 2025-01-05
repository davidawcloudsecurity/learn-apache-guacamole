import { useState } from "react";
import axios from "axios"; // For making API calls
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [guacamoleUrl, setGuacamoleUrl] = useState(""); // URL for Guacamole connection
  const { toast } = useToast();

  // Function to start the VM
  const handleStartVM = async () => {
    setIsLoading(true);
    try {
      // Call backend to start the VM
      const response = await axios.post("/api/start-vm");
      const { guacamoleUrl } = response.data; // Get Guacamole URL from backend

      // Update state
      setGuacamoleUrl(guacamoleUrl);
      setIsConnected(true);
      toast({
        title: "VM Connected",
        description: "Your virtual machine is ready to use",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start VM",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to stop the VM
  const handleStopVM = async () => {
    try {
      // Call backend to stop the VM
      await axios.post("/api/stop-vm");

      // Update state
      setIsConnected(false);
      setGuacamoleUrl("");
      toast({
        title: "VM Stopped",
        description: "Your virtual machine has been stopped",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop VM",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Browser VM Demo</h1>
          <p className="text-gray-600 mb-4">
            This is a demonstration of how a browser-based VM interface might work.
            In a real implementation, this would connect to Apache Guacamole and an
            actual EC2 instance.
          </p>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleStartVM}
              disabled={isLoading || isConnected}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Connecting..." : "Start VM"}
            </Button>

            {isConnected && (
              <Button variant="destructive" onClick={handleStopVM}>
                Stop VM
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="h-[400px] border rounded-md overflow-hidden">
              <iframe
                src={guacamoleUrl} // Guacamole connection URL
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <div className="space-y-2 text-gray-600">
            <p>1. User requests a VM instance</p>
            <p>2. Server provisions an EC2 instance</p>
            <p>3. Apache Guacamole establishes connection</p>
            <p>4. WebSocket connection created with browser</p>
            <p>5. User can interact with VM directly in browser</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
