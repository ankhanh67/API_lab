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
} from 'lucide-react';
import { SITE_CONFIG, TECH_CLASSIFICATIONS } from '@/config/site';

export function Navbar() {
  const pathname = usePathname();
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
              Interactive Architecture & Protocol Simulator
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          <Link
            href="/"
            className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            Tổng quan
          </Link>

          <Link
            href="/fundamentals"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/fundamentals')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Nền tảng API
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
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
                isActive('/modules')
                  ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              7 Công nghệ API
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {modulesOpen && (
              <div className="absolute left-0 top-full pt-1 w-80 z-50">
                <div className="rounded-md border border-slate-800 bg-slate-925 p-2 shadow-2xl">
                  <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      7 Chuyên đề & Phân loại kỹ thuật
                    </p>
                  </div>
                  <div className="space-y-1">
                    {TECH_CLASSIFICATIONS.map((tech, idx) => (
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
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/lab')
                ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                : 'text-sky-300/90 hover:bg-sky-950/40 hover:text-sky-200'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
            API Laboratory
          </Link>

          <Link
            href="/scenarios"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/scenarios')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Kiến trúc Thực tế
          </Link>

          <Link
            href="/comparison"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/comparison')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            So sánh
          </Link>

          <Link
            href="/assessment"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
              isActive('/assessment')
                ? 'bg-slate-800/90 text-sky-400 border border-slate-700'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Kiểm tra
          </Link>
        </nav>

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

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              Tổng quan
            </Link>
            <Link
              href="/fundamentals"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              Nền tảng API
            </Link>
            <Link
              href="/lab"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-sky-500/40 bg-sky-950/40 px-3 py-2 text-xs font-medium text-sky-300"
            >
              API Laboratory
            </Link>
            <Link
              href="/scenarios"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              Kiến trúc Thực tế
            </Link>
            <Link
              href="/comparison"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              Trung tâm So sánh
            </Link>
            <Link
              href="/assessment"
              onClick={() => setMobileOpen(false)}
              className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200"
            >
              Đánh giá Năng lực
            </Link>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2">
              7 Chuyên đề Công nghệ API
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {TECH_CLASSIFICATIONS.map((tech, idx) => (
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
