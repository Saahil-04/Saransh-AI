import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ContextService {
  constructor(private prisma: PrismaService) {}

  async getSessionMessages(sessionId: number, userId: number) {
    return this.prisma.message.findMany({
      where: {
        sessionId: sessionId,
        userId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      // take: 10, // Limit context to last 10 messages     
      select: {
        content: true,
        sender: true,
        createdAt: true,
      },
    })
  }

  async addMessage(content: string, sender: string, sessionId: number, userId: number) {
    return this.prisma.message.create({
      data: {
        content,
        sender,
        sessionId,
        userId,
      },
    })
  }

  async getSessionContext(sessionId: number, userId: number): Promise<string> {
    const messages = await this.getSessionMessages(sessionId, userId)
    return messages.map((msg) => `${msg.sender}: ${msg.content}`).join("\n")
  }
}

