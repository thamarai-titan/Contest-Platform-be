import { prisma } from "../../db/prisma.ts";
import type {
  CreateContestsSchemaType,
  DsaCreationSchemaType,
  McqCreationsSchemaType,
} from "./contests.validateSchema";

export const CreateContestService = async (
  data: CreateContestsSchemaType,
  userId: string,
) => {
  try {
    const { title, description, startTime, endTime } = data;

    const contest = await prisma.contests.create({
      data: {
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        creator_id: userId,
      },
    });

    return contest;
  } catch (error) {
    throw error;
  }
};

export const getContestDetailsService = async (contestId: string) => {
  try {
    const contest = await prisma.contests.findUnique({
      where: {
        id: contestId,
      },
      include: {
        mcq_questions: {
          select: {
            id: true,
            question_text: true,
            options: true,
            points: true,
          },
        },
        dsa_problems: {
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            points: true,
            time_limit: true,
            memory_limit: true,
          },
        },
      },
    });

    if (!contest) {
      throw new Error("CONTEST_NOT_FOUND");
    }

    return contest;
  } catch (error) {
    throw error;
  }
};

export const addMcqToContestService = async (
  contestId: string,
  data: McqCreationsSchemaType,
) => {
  try {
    const { questionText, options, correctOptionIndex, points } = data;

    const mcq = await prisma.mcqQuestions.create({
      data: {
        contest_id: contestId,
        question_text: questionText,
        options: options,
        correct_option_index: correctOptionIndex,
        points: points,
      },
      select: {
        id: true,
        contest_id: true,
      },
    });

    if (!mcq) {
      throw new Error("CONTEST_NOT_FOUND");
    }

    return mcq;
  } catch (error) {
    throw error;
  }
};

export const submitMcq = async (
  userId: string,
  questionId: string,
  selectedIndex: number,
) => {
  try {
    const mcq = await prisma.mcqQuestions.findUnique({
      where: {
        id: questionId,
      },
      include: {
        contest: {
          select: {
            end_time: true,
          },
        },
        mcq_submissions: {
          where: {
            user_id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!mcq) {
      throw new Error("QUESTION_NOT_FOUND");
    }

    const now = new Date();

    if (now > mcq.contest.end_time) {
      throw new Error("CONTEST_NOT_ACTIVE");
    }

    if (mcq.mcq_submissions.length > 0) {
      throw new Error("ALREADY_SUBMITTED");
    }
    const isCorrect = selectedIndex === mcq.correct_option_index;
    const submission = await prisma.mcqSubmissions.create({
      data: {
        selected_option_index: selectedIndex,
        question_id: questionId,
        user_id: userId,
        is_correct: isCorrect,
        points_earned: 1,
      },
    });

    return submission;
  } catch (error) {
    throw error;
  }
};

export const addDsaService = async (data: DsaCreationSchemaType, contestId: string) => {
  try {
      const {
        title,
        description,
        tags,
        points,
        timeLimit,
        memoryLimit,
        testCases
      } = data

      const contest_id = await prisma.contests.findUnique({
        where: {
          id: contestId
        },
        select: {
          id: true
        }
      })

      if(!contest_id){
        throw new Error("CONTEST_NOT_FOUND")
      }

      const dsa = await prisma.dsaProblems.create({
        data: {
          contest_id: contest_id.id,
          title,
          description,
          tags,
          points,
          time_limit: timeLimit,
          memory_limit: memoryLimit,
          test_cases: {
            create:testCases.map(tc => ({
              input: tc.input,
              expected_output: tc.expectedOutput,
              is_hidden: tc.isHidden
            }))   
          }
        },
        select: {
          id: true,
          contest_id: true
        }
      })
      return dsa
  } catch (error) {
    throw error
  }
};
