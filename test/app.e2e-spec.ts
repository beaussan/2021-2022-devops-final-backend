import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await request(app.getHttpServer()).post('/todos/delete-all').expect(200);
  });

  afterEach(async () => {
    await request(app.getHttpServer()).post('/todos/delete-all').expect(200);
    await app.close();
  });

  it('should allow for creation, edition, suppression and listing of todos', async () => {
    const created = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'My todo', isDone: false })
      .expect(201);
    expect(created.body.title).toEqual('My todo');
    expect(created.body.isDone).toEqual(false);

    const uuid = created.body.id;

    const path = `/todos/${uuid}`;

    await request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect([created.body]);

    await request(app.getHttpServer())
      .get(path)
      .expect(200)
      .expect(created.body);

    const newTodos = await request(app.getHttpServer())
      .patch(path)
      .send({ isDone: true, title: 'New title' })
      .expect(200)
      .expect({ id: uuid, isDone: true, title: 'New title' });

    await request(app.getHttpServer())
      .get(path)
      .expect(200)
      .expect(newTodos.body);

    await request(app.getHttpServer())
      .delete(path)
      .expect(200)
      .expect(newTodos.body);
  });

  it('/ hello world', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
