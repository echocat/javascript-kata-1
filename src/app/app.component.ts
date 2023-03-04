import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Literature } from '../shared/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Literature>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  displayedColumns = ['title', 'isbn', 'authors', 'publishedAt'];
  constructor(dataService: DataService) {
    dataService.fetchLiteratures().subscribe((data) => {
      console.log(data);
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.dataSource.filterPredicate = (data: Literature, filter: string) => {
      console.debug(data);
      return (
        data.isbn.toLowerCase().includes(filter.toLowerCase()) ||
        data.authors
          .map((a) => a.email)
          .join(',')
          .toLowerCase()
          .includes(filter.toLowerCase())
      );
    };
  }
  applyFilter(event: KeyboardEvent) {
    this.dataSource.filter = (event.target as HTMLInputElement).value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
