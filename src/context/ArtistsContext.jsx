import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ArtistsContext = createContext({
  artists: [],
  addArtist: () => {},
  updateArtist: () => {},
  deleteArtist: () => {},
  getArtistById: () => null,
});

const STORAGE_KEY = 'tattos_artists_data';

const DEFAULT_ARTISTS = [
  {
    id: 'art-1',
    name: 'Rodrigo Black',
    tag: 'residente', // 'residente' | 'visitante'
    specialty: 'Chicano Lettering & Blackwork',
    splitRate: 70, // % repasse para o artista
    station: 'Bancada 01 — Custom & Blackletter',
    phone: '(11) 98765-4321',
    instagram: '@rodrigoblack_ink',
    email: 'rodrigo.black@tattos.studio',
    status: 'Ativo',
    bio: 'Especialista em caligrafia gótica chicana de alta precisão e sombreamento black & grey suave.',
    totalSessions: 48,
    grossGenerated: 58400,
    originStudio: '',
    guestPeriodStart: '',
    guestPeriodEnd: '',
  },
  {
    id: 'art-2',
    name: 'Luna Ink',
    tag: 'residente',
    specialty: 'Microrealismo, Fine Line & Floral',
    splitRate: 65,
    station: 'Bancada 02 — Microrealismo & Fine',
    phone: '(11) 97654-3210',
    instagram: '@luna.fineart',
    email: 'luna.ink@tattos.studio',
    status: 'Ativo',
    bio: 'Mestra em traços milimétricos com agulhas 03RL e 01RL, botânica detalhada e cicatrização perfeita.',
    totalSessions: 39,
    grossGenerated: 37200,
    originStudio: '',
    guestPeriodStart: '',
    guestPeriodEnd: '',
  },
  {
    id: 'art-3',
    name: 'Marcos Calavera',
    tag: 'residente',
    specialty: 'Traditional Americano, Oriental & Lowrider',
    splitRate: 60,
    station: 'Bancada 03 — Traditional & Lowrider',
    phone: '(11) 99988-7766',
    instagram: '@calavera_trad',
    email: 'marcos.calavera@tattos.studio',
    status: 'Ativo',
    bio: 'Puro estilo clássico com linhas pesadas e cores sólidas, inspirado na estética chicana e lowrider.',
    totalSessions: 31,
    grossGenerated: 31800,
    originStudio: '',
    guestPeriodStart: '',
    guestPeriodEnd: '',
  },
  {
    id: 'art-4',
    name: 'Yasmin Shadow',
    tag: 'residente',
    specialty: 'Body Piercing & Modificação Corporal',
    splitRate: 70,
    station: 'Bancada 04 — Body Piercing & Mod',
    phone: '(11) 98111-2233',
    instagram: '@yasminshadow.piercing',
    email: 'yasmin.shadow@tattos.studio',
    status: 'Ativo',
    bio: 'Piercer profissional certificada em biossegurança e aplicação de joalheria em titânio grau implante.',
    totalSessions: 64,
    grossGenerated: 19400,
    originStudio: '',
    guestPeriodStart: '',
    guestPeriodEnd: '',
  },
  {
    id: 'art-5',
    name: 'Diego "El Flaco" Ortiz',
    tag: 'visitante',
    specialty: 'Black & Grey Realism & Retratos Mexicanos',
    splitRate: 60,
    station: 'Bancada 01 — Custom & Blackletter',
    phone: '+1 (323) 555-0199',
    instagram: '@elflaco_guestart',
    email: 'flaco.ortiz@guestspot.com',
    status: 'Em Guest',
    bio: 'Artista internacional convidado em temporada exclusiva em São Paulo para série limitada de realismo sombreado.',
    totalSessions: 14,
    grossGenerated: 16800,
    originStudio: 'East LA Customs (Los Angeles, CA)',
    guestPeriodStart: '2026-09-10',
    guestPeriodEnd: '2026-09-30',
  },
  {
    id: 'art-6',
    name: 'Klaus Müller',
    tag: 'visitante',
    specialty: 'Dark Dotwork & Geometria Sagrada',
    splitRate: 60,
    station: 'Bancada 03 — Traditional & Lowrider',
    phone: '+49 170 555-4321',
    instagram: '@klausmuller_tattoo',
    email: 'klaus.muller@berlinink.de',
    status: 'Convidado',
    bio: 'Guest spot agendado para a temporada de outubro. Referência europeia em geometria sacra e pontilhismo denso.',
    totalSessions: 0,
    grossGenerated: 0,
    originStudio: 'Kreuzberg Ink Studio (Berlim, Alemanha)',
    guestPeriodStart: '2026-10-05',
    guestPeriodEnd: '2026-10-25',
  },
];

export const ArtistsProvider = ({ children }) => {
  const [artists, setArtists] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Falha ao ler tatuadores do localStorage:', e);
    }
    return DEFAULT_ARTISTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(artists));
    } catch (e) {
      console.error('Falha ao salvar tatuadores no localStorage:', e);
    }
  }, [artists]);

  const addArtist = useCallback((artistData) => {
    const newArtist = {
      id: `art-${Date.now().toString().slice(-4)}`,
      totalSessions: 0,
      grossGenerated: 0,
      status: artistData.tag === 'visitante' ? (artistData.status || 'Em Guest') : 'Ativo',
      ...artistData,
    };
    setArtists((prev) => [newArtist, ...prev]);
    return newArtist;
  }, []);

  const updateArtist = useCallback((id, updatedData) => {
    setArtists((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedData } : art))
    );
  }, []);

  const deleteArtist = useCallback((id) => {
    setArtists((prev) => prev.filter((art) => art.id !== id));
  }, []);

  const getArtistById = useCallback(
    (id) => {
      return artists.find((art) => art.id === id);
    },
    [artists]
  );

  return (
    <ArtistsContext.Provider
      value={{
        artists,
        addArtist,
        updateArtist,
        deleteArtist,
        getArtistById,
      }}
    >
      {children}
    </ArtistsContext.Provider>
  );
};
