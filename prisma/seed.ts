import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const creatorId = 'ffaba545-8bd3-48a6-8c56-ef8896f53075';

const movies = [
  {
    title: 'The Matrix',
    overview: 'A computer hacker learns about the true nature of reality.',
    releaseYear: 1999,
    genres: ['Action', 'Sci-Fi'],
    runtime: 136,
    posterUrl: 'https://example.com/matrix.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Inception',
    overview: 'A thief enters dreams to steal valuable secrets.',
    releaseYear: 2010,
    genres: ['Action', 'Sci-Fi'],
    runtime: 148,
    posterUrl: 'https://example.com/inception.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Interstellar',
    overview: 'Astronauts travel through a wormhole to save humanity.',
    releaseYear: 2014,
    genres: ['Adventure', 'Sci-Fi'],
    runtime: 169,
    posterUrl: 'https://example.com/interstellar.jpg',
    createdBy: creatorId,
  },
  {
    title: 'The Dark Knight',
    overview: 'Batman faces the Joker in Gotham City.',
    releaseYear: 2008,
    genres: ['Action', 'Crime'],
    runtime: 152,
    posterUrl: 'https://example.com/dark-knight.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Avengers: Endgame',
    overview: 'The Avengers make one final attempt to defeat Thanos.',
    releaseYear: 2019,
    genres: ['Action', 'Adventure'],
    runtime: 181,
    posterUrl: 'https://example.com/endgame.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Titanic',
    overview: 'A romance blossoms aboard the ill-fated Titanic.',
    releaseYear: 1997,
    genres: ['Drama', 'Romance'],
    runtime: 195,
    posterUrl: 'https://example.com/titanic.jpg',
    createdBy: creatorId,
  },
  {
    title: 'The Godfather',
    overview: 'The aging patriarch transfers control of his empire.',
    releaseYear: 1972,
    genres: ['Crime', 'Drama'],
    runtime: 175,
    posterUrl: 'https://example.com/godfather.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Pulp Fiction',
    overview: 'Several crime stories intertwine in Los Angeles.',
    releaseYear: 1994,
    genres: ['Crime', 'Drama'],
    runtime: 154,
    posterUrl: 'https://example.com/pulp-fiction.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Fight Club',
    overview: 'An office worker forms an underground fight club.',
    releaseYear: 1999,
    genres: ['Drama'],
    runtime: 139,
    posterUrl: 'https://example.com/fight-club.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Forrest Gump',
    overview: 'An extraordinary man witnesses historical events.',
    releaseYear: 1994,
    genres: ['Drama', 'Romance'],
    runtime: 142,
    posterUrl: 'https://example.com/forrest-gump.jpg',
    createdBy: creatorId,
  },
  {
    title: 'Gladiator',
    overview: 'A Roman general seeks revenge against an emperor.',
    releaseYear: 2000,
    genres: ['Action', 'Drama'],
    runtime: 155,
    posterUrl: 'https://example.com/gladiator.jpg',
    createdBy: creatorId,
  },
  {
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over decades.',
    releaseYear: 1994,
    genres: ['Drama'],
    runtime: 142,
    posterUrl: 'https://example.com/shawshank.jpg',
    createdBy: creatorId,
  },
];

const main = async () => {
  console.log('Seeding movies...');

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });

    console.log(`Created movie: ${movie.title}`);
  }

  console.log('Seeding completed!');
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
