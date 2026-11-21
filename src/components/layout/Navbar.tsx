'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Terminal,
  BookOpen,
  Cpu,
  FlaskConical,
  Layers,
  GitCompare,
  Award,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { SITE_CONFIG, getTechClassifications } from '@/config/site';
import { useAppPreferences } from '@/context/AppPreferencesContext';

export function Navbar() {
  const pathname = usePathname();
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, theme, toggleTheme, ui } = useAppPreferences();

  const techList = getTechClassifications(lang);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-sky-500/40 bg-sky-950/60 text-sky-400 transition-colors group-hover:border-sky-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-slate-100">
                {SITE_CONFIG.name}
              </span>
              <span className="rounded border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-sky-300">
                v1.0 LAB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {ui.nav.subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          <Link
            href="/"
            className={`px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            {ui.nav.overview}
          </Link>

          <Link
            href="/fundamentals"
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/fundamentals')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {ui.nav.fundamentals}
          </Link>

          {/* 7 Modules Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setModulesOpen(true)}
            onMouseLeave={() => setModulesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setModulesOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
                isActive('/modules')
                  ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              {ui.nav.modulesBtn}
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {modulesOpen && (
              <div className="absolute left-0 top-full pt-1 w-80 z-50">
                <div className="rounded-md border border-slate-800 bg-slate-925 p-2 shadow-2xl">
                  <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {ui.nav.modulesDropdownHeader}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {techList.map((tech, idx) => (
                      <Link
                        key={tech.id}
                        href={tech.href}
                        onClick={() => setModulesOpen(false)}
                        className="flex items-start justify-between rounded px-2.5 py-2 hover:bg-slate-800/80 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500">
                              0{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-100">
                              {tech.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-5">
                            {tech.natureEn}
                          </p>
                        </div>
                        <span
                          className="mt-1 h-2 w-2 rounded-full"
                          style={{ backgroundColor: tech.accentHex }}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/lab"
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/lab')
                ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                : 'text-sky-300/90 hover:bg-sky-950/40 hover:text-sky-200'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
            {ui.nav.lab}
          </Link>

          <Link
            href="/scenarios"
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/scenarios')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {ui.nav.scenarios}
          </Link>

          <Link
            href="/comparison"
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/comparison')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            {ui.nav.comparison}
          </Link>

          <Link
            href="/assessment"
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/assessment')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            {ui.nav.assessment}
          </Link>
        </nav>

        {/* Language & Theme Controls + Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill (VI | EN) */}
          <div
            className="inline-flex items-center rounded border border-slate-800 bg-slate-900 p-0.5 font-mono text-[11px]"
            role="group"
            aria-label="Language Switcher"
          >
            <Languages className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`rounded px-2 py-1 font-bold transition-colors ${
                lang === 'vi'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded px-2 py-1 font-bold transition-colors ${
                lang === 'en'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Switcher Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-200 hover:border-sky-500/50 transition-colors"
            aria-label="Toggle Light/Dark Theme"
            title={
              theme === 'dark'
                ? lang === 'en'
                  ? 'Switch to Light Mode'
                  : 'Chuyển sang Giao diện Sáng'
                : lang === 'en'
                ? 'Switch to Dark Mode'
                : 'Chuyển sang Giao diện Tối'
            }
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">{ui.nav.themeLight}</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden sm:inline">{ui.nav.themeDark}</span>
              </>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden rounded border border-slate-800 p-2 text-slate-300 hover:bg-slate-900"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.nav.overview}
            </Link>
            <Link
              href="/fundamentals"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.nav.fundamentals}
            </Link>
            <Link
              href="/lab"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-sky-500/40 bg-sky-950/40 px-3 py-2 text-xs font-medium text-sky-300"
            >
              {ui.nav.lab}
            </Link>
            <Link
              href="/scenarios"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.nav.scenarios}
            </Link>
            <Link
              href="/comparison"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.nav.comparison}
            </Link>
            <Link
              href="/assessment"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              {ui.nav.assessment}
            </Link>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2">
              {ui.nav.mobileModulesHeader}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {techList.map((tech, idx) => (
                <Link
                  key={tech.id}
                  href={tech.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-slate-200">
                    0{idx + 1}. {tech.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {tech.natureEn}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
