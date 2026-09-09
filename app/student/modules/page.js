'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  LEARN_PAGE_STYLE,
  LEARN_PAGE_SHELL_HTML,
  EMPTY_STATE_HTML,
  buildCardHtml,
} from '@/components/student/learnPageMarkup';
import { initLearnPage } from '@/components/student/learnPageBehavior';

const DIFFICULTY_WEIGHT = { beginner: 1, intermediate: 2, advanced: 3 };

export default function StudentModulesPage() {
  const router = useRouter();
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isStudent()) { router.push('/login'); return; }
    let cancelled = false;
    (async () => {
      try {
        const [modulesData, paymentData] = await Promise.all([modules.getAll(), payment.getPaymentStatus()]);
        if (cancelled) return;
        setModulesList(Array.isArray(modulesData) ? modulesData : []);
        setPaymentStatus(paymentData);
      } catch (err) {
        console.error('Failed to load learn page:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const sortedModules = useMemo(() => (
    [...modulesList].sort((a, b) => (DIFFICULTY_WEIGHT[a.difficulty] || 4) - (DIFFICULTY_WEIGHT[b.difficulty] || 4))
  ), [modulesList]);

  const html = useMemo(() => {
    if (loading) return '';
    const isPaid = !!paymentStatus?.isPaid;
    const cards = sortedModules.length
      ? sortedModules.map((m, i) => buildCardHtml(m, i, isPaid)).join('\n')
      : EMPTY_STATE_HTML;
    return LEARN_PAGE_SHELL_HTML.replace('<!--CARDS-->', cards);
  }, [loading, sortedModules, paymentStatus]);

  useEffect(() => {
    if (loading) return;
    const root = containerRef.current;
    if (!root) return;
    const cleanup = initLearnPage(root, { onNav: (href) => router.push(href) });
    return cleanup;
  }, [loading, html, router]);

  if (loading) return <LoadingSpinner message="Loading modules..." />;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LEARN_PAGE_STYLE }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
