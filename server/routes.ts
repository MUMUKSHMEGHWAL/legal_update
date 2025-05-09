import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Base URL for the external API
  const API_BASE_URL = "https://api.livspace.com/launchpad-backend/v1";

  // Proxy endpoint to update legal information
  app.put("/api/projects/:projectId/legal", async (req, res) => {
    try {
      const { projectId } = req.params;
      const payload = req.body;
      
      // Validate request payload
      if (!payload || (Object.keys(payload).length === 0)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid request payload. At least one of PAN or GSTIN must be provided." 
        });
      }
      
      // Get auth token from headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          message: "Authorization token is required" 
        });
      }
      
      // Forward the request to the external API
      try {
        const response = await axios({
          method: 'PUT',
          url: `${API_BASE_URL}/projects/${projectId}/legal`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          data: payload
        });
        
        return res.status(response.status).json({
          success: true,
          message: "Legal information updated successfully",
          data: response.data
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status || 500;
          const errorMessage = error.response?.data?.message || error.message || "An error occurred while updating legal information";
          
          return res.status(status).json({
            success: false,
            message: errorMessage
          });
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Error updating legal information:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
