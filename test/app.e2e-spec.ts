import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });
  // access url
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    // read movies
    it('(GET) 200', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });
    // create a movie
    it('(POST) 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['test'],
        })
        .expect(201);
    });
    // try to create a movie with a wrong parameter
    it('(POST) 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['test'],
          other: 'thing',
        })
        .expect(400);
    });
    // try to delete all movies
    it('(DELETE) 404', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    // read a movie that create for testing at line 38
    it('(GET) 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });
    // try to read a movie with doesn't exist
    it('(GET) 404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });
    // update a movie title
    it('(PATCH) 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({
          title: 'Updated Test',
        })
        .expect(200);
    });
    // delete a movie
    it('(DELETE) 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
