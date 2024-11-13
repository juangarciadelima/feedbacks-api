import { Elysia, t } from "elysia";
import { prisma } from "../lib/prisma.ts";
import type {
  Feedbacks,
  Prisma,
  Questions,
  QuestionsRatings,
} from "@prisma/client";

import dayjs from "dayjs";
import { authentication } from "@/http/auth.ts";

export const getGroupAnalysis = new Elysia({
  tags: ["Análises"],
  detail: {
    description:
      "Get an analysis of the feedbacks generated in a amount of time",
  },
})
  .use(authentication)
  .get(
    "/get-group-analysis",
    async ({ query }) => {
      const { selectedGroup, amountOfTime } = query;

      const dataThreshold = dayjs(amountOfTime).toISOString();

      const where: Prisma.FeedbacksWhereInput = {
        questionSetId: selectedGroup,
        date: {
          gte: dataThreshold,
        },
      };

      const feedbacksNumber = await prisma.feedbacks.findMany({
        where: where,
      });

      interface DataItem {
        [key: string]: any;
        notes: any[];
      }

      function mergeData<T extends DataItem>(data: T[]): T[] {
        const mergedData: { [key: string]: T } = {};

        data.forEach((item) => {
          const keys = Object.keys(item);

          const key = keys.find((k) => k !== "notes");
          if (!key) return;

          const id = item[key];
          const notes = item.notes;

          if (!mergedData[id]) {
            mergedData[id] = { ...item, notes: [] };
          }
          mergedData[id].notes = mergedData[id].notes.concat(notes);
        });

        return Object.values(mergedData);
      }

      const calculateAverage = (questions: QuestionsRatings[]) => {
        if (questions.length === 0) return 0;

        const total = questions.reduce(
          (sum, question) => sum + (question?.rating || 0),
          0,
        );
        return total / questions.length;
      };

      const questions = feedbacksNumber.flatMap(
        (feedback) => feedback.questions,
      );

      const ratingsOfAllAnsweredFeedbacks = questions
        .map((question) => question.rating)
        .filter((rating) => rating !== null);

      const userNotes = feedbacksNumber.map((feedback) => {
        return {
          reviewed: feedback.reviewed,
          notes: feedback.questions
            .map((question) => question.rating)
            .filter((rating) => rating !== null),
        };
      });

      const userNotes2 = mergeData(userNotes);

      const extractQuestionIds = Array.from(
        new Set(questions.map((question) => question.id)),
      );

      const questionNotes = extractQuestionIds.map((questionId) => {
        return {
          questionName: questions.find((question) => question.id === questionId)
            ?.questionName,
          notes: questions
            .filter((question) => question.id === questionId)
            .map((question) => question.rating)
            .filter((rating) => rating !== null),
        };
      });

      const questionNotes2 = mergeData(questionNotes);

      const filteredQuestionsWithObservation = questions.filter(
        (question) => question.observation !== null,
      );

      const realizedObservations = filteredQuestionsWithObservation.map(
        (actualQuestion) => {
          return {
            observation: actualQuestion.observation,
            reviewer: feedbacksNumber.find((feedback) =>
              feedback.questions.find(
                (question) => question.id === actualQuestion.id,
              ),
            )?.reviewer,
            date: feedbacksNumber.find((feedback) =>
              feedback.questions.find(
                (question) => question.id === actualQuestion.id,
              ),
            )?.date,
          };
        },
      );

      const usersReviewed = feedbacksNumber.map(
        (feedback) => feedback.reviewed,
      );

      const uniqueUsersReviewed = Array.from(new Set(usersReviewed));

      const graphData = feedbacksNumber.map((feedback) => {
        return {
          date: dayjs(feedback.date).format("DD/MM/YYYY"),
          notes: feedback.questions
            .map((question) => question.rating)
            .filter((rating) => rating !== null),
          maxRating: 5,
        };
      });

      const mergedGraphData = mergeData(graphData);

      return {
        numberOfRealizedFeedbacks: feedbacksNumber.length,
        reviewedUsers: uniqueUsersReviewed,
        realizedObservations,
        notesOfAnsweredQuestions: questionNotes2,
        ratingsOfAllAnsweredFeedbacks,
        sendedNotesPerUser: userNotes2,
        graphData: mergedGraphData,
      };
    },
    {
      query: t.Object({
        selectedGroup: t.String(),
        amountOfTime: t.String(),
      }),
    },
  );
