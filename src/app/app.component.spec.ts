import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { AppModule } from './app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LiteratureService } from '../shared/literature.service';
import { EventEmitter } from '@angular/core';
import { MatInputHarness } from '@angular/material/input/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;
  const fetchLiteraturesMock = new EventEmitter();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [AppComponent],
      providers: [
        {
          provide: LiteratureService,
          useValue: {
            fetchLiteratures: () => fetchLiteraturesMock,
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('should show all details', () => {
    beforeEach(() => {
      fetchLiteraturesMock.next([
        {
          title: 'z',
          isbn: 'isbn-z',
          authors: [
            {
              email: 'z-email1',
              firstName: 'z-firstName1',
              lastName: 'z-lastName1',
            },
            {
              email: 'z-email2',
              firstName: 'z-firstName2',
              lastName: 'z-lastName2',
            },
          ],
          publishedAt: new Date('2020-01-01'),
        },

        {
          title: 'a',
          isbn: 'isbn-a',
          authors: [
            {
              email: 'a-email1',
              firstName: 'a-firstName1',
              lastName: 'a-lastName1',
            },
          ],
          publishedAt: new Date('2020-01-01'),
        },
        {
          title: 'A',
          isbn: 'isbn-A',
          authors: [
            {
              email: 'A-email1',
              firstName: 'A-firstName1',
              lastName: 'A-lastName1',
            },
          ],
          description: 'description-A',
        },
        {
          title: 'b',
          isbn: 'isbn-b',
          authors: [
            {
              email: 'b-email1',
              firstName: 'b-firstName1',
              lastName: 'b-lastName1',
            },
          ],
          description: 'description-b',
        },
        {
          title: '1',
          isbn: 'isbn-1',
          authors: [
            {
              email: '1-email1',
              firstName: '1-firstName1',
              lastName: '1-lastName1',
            },
          ],
          description: 'description-1',
        },
      ]);
    });

    it('sorted by title', async () => {
      fixture.detectChanges();

      const table = await loader.getHarness(MatTableHarness);
      const content: string[][] = await table.getCellTextByIndex();
      expect(content).toEqual([
        ['1 info', 'isbn-1', '1-firstName1 1-lastName1 <1-email1>', ''],
        ['A info', 'isbn-A', 'A-firstName1 A-lastName1 <A-email1>', ''],
        [
          'a',
          'isbn-a',
          'a-firstName1 a-lastName1 <a-email1>',
          'Wed Jan 01 2020 01:00:00 GMT+0100 (Central European Standard Time)',
        ],
        ['b info', 'isbn-b', 'b-firstName1 b-lastName1 <b-email1>', ''],
        [
          'z',
          'isbn-z',
          'z-firstName1 z-lastName1 <z-email1>,  z-firstName2 z-lastName2 <z-email2>',
          'Wed Jan 01 2020 01:00:00 GMT+0100 (Central European Standard Time)',
        ],
      ]);
    });

    it('filtered by isbn or authors email', async () => {
      fixture.detectChanges();
      const input = await loader.getHarness(MatInputHarness);
      const table = await loader.getHarness(MatTableHarness);
      let content: string[][];

      await input.setValue('isbn-1');
      content = await table.getCellTextByIndex();
      expect(content).toEqual([
        ['1 info', 'isbn-1', '1-firstName1 1-lastName1 <1-email1>', ''],
      ]);

      await input.setValue('z-email1');
      content = await table.getCellTextByIndex();
      expect(content).toEqual([
        [
          'z',
          'isbn-z',
          'z-firstName1 z-lastName1 <z-email1>,  z-firstName2 z-lastName2 <z-email2>',
          'Wed Jan 01 2020 01:00:00 GMT+0100 (Central European Standard Time)',
        ],
      ]);

      await input.setValue('foobar');
      content = await table.getCellTextByIndex();
      expect(content).toEqual([]);
    });
  });
});
