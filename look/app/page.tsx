"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import pb from '../../logic/lib/pocketbase';
import {getFinishedOffersCount} from '../../logic/lib/offers';
import { todayIso } from '../utils/dateFormatter';

const steps = [
  {
    title: '1. Znajdź rejs',
    description: 'Przeglądaj oferty i wybierz termin, który Ci pasuje.',
  },
  {
    title: '2. Wyślij rezerwację',
    description: 'Skontaktuj się z organizatorem przez prosty formularz.',
  },
  {
    title: '3. Płyń z ekipą',
    description: 'Po potwierdzeniu jesteś gotowy na rejs.',
  },
];

type HomeStats = {
  activeOffers: number;
  organizers: number;
  confirmedBookings: number;
  finishedOffers: number;
};

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<HomeStats | null>(null);

  useEffect(() => {
    setIsLoggedIn(pb.authStore.isValid);

    const unsubscribe = pb.authStore.onChange(() => {
      setIsLoggedIn(pb.authStore.isValid);
    });

    Promise.all([
      pb.collection('offers').getList(1, 1, {
        filter: `date_to >= "${todayIso()}"`,
      }),
      (pb.collection('offers') as any).getFullList({
        fields: 'organizer_id',
      }),
      pb.collection('bookings').getList(1, 1, {
        filter: 'status = "confirmed"',
      }),
      getFinishedOffersCount(),
    ])
      .then(([activeOffersResult, offers, confirmedBookingsResult, finishedOffers]) => {
        const organizerIds = new Set(
          (offers as Array<{ organizer_id?: string }>)
            .map((offer) => offer.organizer_id)
            .filter((id): id is string => Boolean(id))
        );

        setStats({
          activeOffers: activeOffersResult.totalItems,
          organizers: organizerIds.size,
          confirmedBookings: confirmedBookingsResult.totalItems,
          finishedOffers: finishedOffers.totalItems,
        });
      })
      .catch(() => {
        setStats({
          activeOffers: 0,
          organizers: 0,
          confirmedBookings: 0,
          finishedOffers: 0,
        });
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="mb-3 inline-flex rounded-full bg-main-soft px-3 py-1 text-sm font-medium text-main">
            Sindbad
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Znajdź rejs. Zarezerwuj miejsce. Płyń.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Prosta platforma do łączenia załogantów i organizatorów rejsów.
            By budować zaufaną sieć kontaktów na wodzie.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/szukaj"
              className="rounded-lg bg-main px-5 py-3 text-sm font-semibold text-white transition hover-bg-main"
            >
              Szukaj rejsów
            </Link>
            <Link
              href={isLoggedIn ? '/oferta/nowa' : '/logowanie'}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Dodaj ofertę
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Jak to działa</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Zaufali nam</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900">
              {stats ? stats.activeOffers : '...'}
            </p>
            <p className="mt-2 text-sm text-slate-600">Aktywne rejsy</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900">
              {stats ? stats.organizers : '...'}
            </p>
            <p className="mt-2 text-sm text-slate-600">Organizatorzy</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900">
              {stats ? stats.confirmedBookings : '...'}
            </p>
            <p className="mt-2 text-sm text-slate-600">Potwierdzone rezerwacje</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900">
              {stats ? stats.finishedOffers : '...'}
            </p>
            <p className="mt-2 text-sm text-slate-600">Zakończone</p>
          </article>
        </div>
      </section>
    </main>
  );
}