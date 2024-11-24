import { Request, Response } from 'express';
import prisma from '../prisma/prismaClient';

// Sign up a participant for an event
export const registerParticipant = async (req: Request, res: Response): Promise<void> => {
  const { eventId, userId } = req.body;

  // Validate input
  if (!eventId || !userId ) {
    res.status(400).json({ error: 'Missing required fields: eventId or userId' });
    return
  }

  try {
    // Ensure `eventId` and `userId` are valid integers
    const parsedEventId = parseInt(eventId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedEventId) || isNaN(parsedUserId)) {
      res.status(400).json({ error: 'Invalid eventId or userId' });
      return
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: parsedEventId },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return
    }

    // Check if the user is already signed up
    const existingParticipation = await prisma.participant.findFirst({
      where: {
        eventId: parsedEventId,
        userId: parsedUserId,
      },
    });

    if (existingParticipation) {
      res.status(400).json({ error: 'User is already signed up for this event' });
      return
    }

    // Create the participant
    const participant = await prisma.participant.create({
      data: {
        eventId: parsedEventId,
        userId: parsedUserId,
      },
    });

    res.status(201).json(participant);
    return
  } catch (error) {
    console.error('Error registering participant:', error);
    res.status(500).json({ error: 'Failed to register participant' });
    return
  }
};

// Get participants for an event
export const getParticipantsByEvent = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    // Ensure `eventId` is a valid integer
    const parsedEventId = parseInt(eventId, 10);
    if (isNaN(parsedEventId)) {
      res.status(400).json({ error: 'Invalid eventId' });
      return
    }

    // Fetch participants for the event
    const participants = await prisma.participant.findMany({
      where: { eventId: parsedEventId },
      include: {
        user: true, // Include user details
        event: true, // Optionally include event details
      },
    });

    res.status(200).json(participants);
    return
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
    return
  }
};