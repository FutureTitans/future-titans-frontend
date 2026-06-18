import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let questionsCache = null;

const TAG_MAP = {
  0: ['spot-shift'],
  1: ['unbundle-understand', 'unbundle-understand-quiz'],
  2: ['reframe-run', 'reframe-run-quiz'],
  3: ['mvp-launchpad', 'module-4-quiz'],
  4: ['evaluate-empower', 'module-5-quiz'],
};

function loadQuestions() {
  if (!questionsCache) {
    const filePath = path.join(process.cwd(), 'data', 'answers.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    questionsCache = JSON.parse(raw).questions;
  }
  return questionsCache;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function selectQuestions(pool, count = 10) {
  const easy = pool.filter(q => q.level === 'easy');
  const medium = pool.filter(q => q.level === 'medium');
  const hard = pool.filter(q => q.level === 'hard');

  const selected = [];
  const targets = [
    { items: shuffle(easy), target: 3 },
    { items: shuffle(medium), target: 4 },
    { items: shuffle(hard), target: 3 },
  ];

  let remaining = count;
  for (const { items, target } of targets) {
    const take = Math.min(target, items.length, remaining);
    selected.push(...items.slice(0, take));
    remaining -= take;
  }

  if (remaining > 0) {
    const usedIds = new Set(selected.map(q => q.id));
    const leftover = shuffle(pool.filter(q => !usedIds.has(q.id)));
    selected.push(...leftover.slice(0, remaining));
  }

  return shuffle(selected).slice(0, count);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterOrder = parseInt(searchParams.get('chapterOrder'));
    const studentClass = searchParams.get('studentClass') || '8';

    if (isNaN(chapterOrder) || chapterOrder < 0 || chapterOrder > 4) {
      return NextResponse.json({ error: 'Invalid chapterOrder (0-4)' }, { status: 400 });
    }

    const allQuestions = loadQuestions();
    const tags = TAG_MAP[chapterOrder];

    const tagFiltered = allQuestions.filter(q =>
      q.tags.some(t => tags.includes(t))
    );

    const classNum = parseInt(studentClass) || 8;
    let pool = tagFiltered.filter(q => q.class === classNum);
    let usedFallback = false;

    if (pool.length < 10) {
      pool = tagFiltered.filter(q => q.class === 8);
      usedFallback = true;
    }
    if (pool.length < 10) {
      pool = tagFiltered;
      usedFallback = true;
    }

    const selected = selectQuestions(pool, 10);

    const sanitized = selected.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      questions: sanitized,
      totalQuestions: sanitized.length,
      chapterOrder,
      usedFallback,
    });
  } catch (error) {
    console.error('Quiz questions error:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
