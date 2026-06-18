import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let questionsCache = null;

function loadQuestions() {
  if (!questionsCache) {
    const filePath = path.join(process.cwd(), 'data', 'answers.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    questionsCache = JSON.parse(raw).questions;
  }
  return questionsCache;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0 || answers.length > 10) {
      return NextResponse.json({ error: 'Invalid answers array' }, { status: 400 });
    }

    const allQuestions = loadQuestions();
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));

    let correct = 0;
    const results = [];

    for (const { questionId, selectedIndex } of answers) {
      const question = questionMap.get(questionId);
      if (!question) {
        results.push({ questionId, error: 'Question not found' });
        continue;
      }

      if (typeof selectedIndex !== 'number' || selectedIndex < 0 || selectedIndex > 3) {
        results.push({ questionId, error: 'Invalid selectedIndex' });
        continue;
      }

      const isCorrect = selectedIndex === question.correct_answer_index;
      if (isCorrect) correct++;

      results.push({
        questionId,
        question: question.question,
        options: question.options,
        selectedIndex,
        correctIndex: question.correct_answer_index,
        isCorrect,
        correctAnswer: question.options[question.correct_answer_index]?.letter,
        explanation: question.explanation,
      });
    }

    return NextResponse.json({
      score: correct,
      totalQuestions: answers.length,
      percentage: Math.round((correct / answers.length) * 100),
      results,
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
