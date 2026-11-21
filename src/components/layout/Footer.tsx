'use client';

import React from 'react';
import Link from 'next/link';
import { getSiteConfig, getTechClassifications } from '@/config/site';
import { Terminal, ShieldCheck } from 'lucide-react';
import { useAppPreferences } from '@/context/AppPreferencesContext';

export function Footer() {
  const { lang, ui } = useAppPreferences();
  const siteConfig = getSiteConfig(lang);
  const techList = getTechClassifications(lang);

  return (
    <footer className="border-t border-slate-800/90 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <Terminal className="h-5 w-5 text-sky-400" />
              <span className="font-mono text-sm font-bold text-slate-100">
                {siteConfig.name} — {siteConfig.headlineEn}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-xl">
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-2 rounded border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-[11px] text-amber-300/90">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{siteConfig.simulationDisclaimer}</span>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {ui.footer.learningModules}
            </h3>
            <ul className="space-y-1.5 text-xs">
              {techList.map((tech) => (
                <li key={tech.id}>
                  <Link
                    href={tech.href}
                    className="hover:text-sky-400 transition-colors flex items-center justify-between"
                  >
                    <span>{tech.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {tech.natureEn}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {ui.footer.practiceAndAssessment}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/fundamentals" className="hover:text-sky-400 transition-colors">
                  {ui.footer.fundamentalsLink}
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-sky-400 transition-colors">
                  {ui.footer.labLink}
                </Link>
              </li>
              <li>
                <Link href="/scenarios" className="hover:text-sky-400 transition-colors">
                  {ui.footer.scenariosLink}
                </Link>
              </li>
              <li>
                <Link href="/comparison" className="hover:text-sky-400 transition-colors">
                  {ui.footer.comparisonLink}
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-sky-400 transition-colors">
                  {ui.footer.assessmentLink}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
