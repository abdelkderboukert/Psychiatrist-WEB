import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, type Timestamp } from "firebase/firestore"

export interface Feedback {
  id?: string
  name: string
  rating: number
  message: string
  date: Timestamp | string
  approved: boolean
  language: string
}

export interface FeedbackInput {
  name: string
  rating: number
  message: string
  language: string
}

const FEEDBACK_COLLECTION = "feedback"

export class FeedbackService {
  // Submit new feedback
  static async submitFeedback(feedbackData: FeedbackInput): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
        ...feedbackData,
        date: serverTimestamp(),
        approved: false, // Feedback needs admin approval before showing
      })
      return docRef.id
    } catch (error) {
      console.error("Error submitting feedback:", error)
      throw new Error("Failed to submit feedback")
    }
  }

  // Get approved feedback
  static async getApprovedFeedback(): Promise<Feedback[]> {
    try {
      const q = query(collection(db, FEEDBACK_COLLECTION), where("approved", "==", true), orderBy("date", "desc"))

      const querySnapshot = await getDocs(q)
      const feedback: Feedback[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        feedback.push({
          id: doc.id,
          name: data.name,
          rating: data.rating,
          message: data.message,
          date: data.date,
          approved: data.approved,
          language: data.language,
        })
      })

      return feedback
    } catch (error) {
      console.error("Error fetching feedback:", error)
      throw new Error("Failed to fetch feedback")
    }
  }

  // Get all feedback (for admin use)
  static async getAllFeedback(): Promise<Feedback[]> {
    try {
      const q = query(collection(db, FEEDBACK_COLLECTION), orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)
      const feedback: Feedback[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        feedback.push({
          id: doc.id,
          name: data.name,
          rating: data.rating,
          message: data.message,
          date: data.date,
          approved: data.approved,
          language: data.language,
        })
      })

      return feedback
    } catch (error) {
      console.error("Error fetching all feedback:", error)
      throw new Error("Failed to fetch feedback")
    }
  }
}
