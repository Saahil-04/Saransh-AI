import { HttpService } from "@nestjs/axios"
import { HttpException, HttpStatus, Injectable, ParseIntPipe } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { PrismaService } from "src/prisma/prisma.service"
import * as FormData from "form-data"

@Injectable()
export class UploadImageService {
  constructor(
    private prisma:PrismaService,
    private httpService: HttpService,
  ) {}

  async uploadAndProcessImage(
    file: Express.Multer.File,
    sessionId: number,
    userId?: number,
  ): Promise<{ userMessage: any; botResponse: string }> {
    if (!file.mimetype.startsWith("image/")) {
      throw new HttpException("Invalid file type. Only image files are allowed.", HttpStatus.BAD_REQUEST)
    }
    const userInput = `🖼️${file.originalname}`
    const numericSessionId = Number(sessionId)
    console.log(`userInput-${userInput} and sessionID-${numericSessionId} for userId ${userId} data being added`);
    try {
      const imageSummary = await this.sendImageToFastapi(file)
      const userMessage = await this.prisma.message.create({
        data: {
          content: userInput,
          sender: "user",
          userId,
          sessionId: numericSessionId,
        },
      })

      console.log("Userid", userId)
      if (userId) {
        console.log("Saving user message to the database for userId:", userId)
        // Save the image summary as a message for authenticated users
        await this.prisma.message.create({
          data: {
            content: imageSummary,
            sender: "bot",
            userId,
            sessionId: numericSessionId,
          },
        })

        const session = await this.prisma.session.findUnique({
          where: { id: numericSessionId },
        })
        if (session && session.name === "New Chat") {
          const newSessionName = await this.generateSessionName(imageSummary)
          await this.prisma.session.update({
            where: { id: numericSessionId },
            data: { name: newSessionName },
          })
        }
      }

      return { userMessage, botResponse: imageSummary }
    } catch (error) {
      console.error("Error processing image file:", error.message)
      throw new HttpException("Failed to process image file.", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async generateSessionName(content: string): Promise<string> {
    console.log("Sending content ", content)
    const fastApiUrl = "http://127.0.0.1:8000"
    const cleanedContent = content.replace(/\n/g, " ").replace(/['"]+/g, "")

    const payload = {
      content: cleanedContent,
    }

    console.log("Sending Payload:", JSON.stringify(payload))
    try {
      console.log("INSIDE TRY STATEMENT")
      const response = await firstValueFrom(
        this.httpService.post(`${fastApiUrl}/generate_title`, payload, {
          headers: { "Content-Type": "application/json" },
        }),
      )
      return response.data.title
    } catch (error) {
      console.error("Error generating session title:", error.message)
      return "Untitled Session"
    }
  }

  private async sendImageToFastapi(file: Express.Multer.File): Promise<string> {
    const fastApiUrl = "http://127.0.0.1:8000/upload_image"
    const formData = new FormData()
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    })
    console.log("this is the formData", formData)

    try {
      const response = await firstValueFrom(
        this.httpService.post(fastApiUrl, formData, {
          headers: formData.getHeaders(),
        }),
      )
      return response.data.response
    } catch (error) {
      console.error("Error communicating with FastAPI:", error.message)
      throw new Error("Failed to process image with FastAPI")
    }
  }
}

