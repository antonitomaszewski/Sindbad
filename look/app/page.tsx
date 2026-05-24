"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import pb from '../../logic/lib/pocketbase';

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
};

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<HomeStats | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    setIsLoggedIn(pb.authStore.isValid);

    const unsubscribe = pb.authStore.onChange(() => {
      setIsLoggedIn(pb.authStore.isValid);
    });

    const today = new Date().toISOString().slice(0, 10);

    Promise.all([
      pb.collection('offers').getList(1, 1, {
        filter: `date_to >= "${today}"`,
      }),
      (pb.collection('offers') as any).getFullList({
        fields: 'organizer_id',
      }),
      pb.collection('bookings').getList(1, 1, {
        filter: 'status = "confirmed"',
      }),
    ])
      .then(([activeOffersResult, offers, confirmedBookingsResult]) => {
        const organizerIds = new Set(
          (offers as Array<{ organizer_id?: string }>)
            .map((offer) => offer.organizer_id)
            .filter((id): id is string => Boolean(id))
        );

        setStats({
          activeOffers: activeOffersResult.totalItems,
          organizers: organizerIds.size,
          confirmedBookings: confirmedBookingsResult.totalItems,
        });
      })
      .catch(() => {
        setStats({
          activeOffers: 0,
          organizers: 0,
          confirmedBookings: 0,
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
          <p className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
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
              className="rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Szukaj rejsów
            </Link>
            {isHydrated && isLoggedIn && (
              <Link
                href="/oferta/nowa"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Dodaj ofertę
              </Link>
            )}
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
        <div className="grid gap-4 sm:grid-cols-3">
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
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Masz pomysł na rejs? Dodaj ofertę w 2 minuty.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Uzupełnij podstawowe informacje i opublikuj rejs dla załogi.
          </p>

          <div className="mt-6">
            {isHydrated && isLoggedIn ? (
              <Link
                href="/oferta/nowa"
                className="inline-flex rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Dodaj ofertę
              </Link>
            ) : (
              <Link
                href="/logowanie"
                className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Zaloguj się i dodaj ofertę
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}