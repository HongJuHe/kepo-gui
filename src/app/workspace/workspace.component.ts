import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfigService } from '../services/config.service';
import { IModule, IModuleGroup } from '../models/module';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  loadedModules: IModule[] = [
    {
      title: '입력',
      description: '입력 모듈에 관한 설명',
      index: '',
      arguments: '',
      fixed: true,
      icon: 'texture',
      background: 'darkGray'
    },
    {
      title: '출력',
      description: '출력 모듈에 관한 설명',
      index: '',
      arguments: '',
      fixed: true,
      icon: 'texture',
      background: 'darkGray'
    }
  ];

  orgGroups: IModuleGroup[];
  groups: IModuleGroup[];
  groupColors: string[] = ['#4c78a8', '#9ecae9', '#f58518', '#ffbf79', '#54a24b'];

  constructor(private cs: ConfigService) { }

  ngOnInit(): void {
    this.cs.loadConfig().subscribe((r) => {
      this.groups = r;
      this.orgGroups = JSON.parse(JSON.stringify(r));
    });
  }

  onTaskDrop(event: CdkDragDrop<IModule[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  noReturnPredicate(): boolean {
    return false;
  }

  onReset(): void {
    this.loadedModules = this.loadedModules.filter(m => m.fixed);
    this.groups = JSON.parse(JSON.stringify(this.orgGroups));
  }

  onExecute(): void {
    let thiss;
    let ar =[];

    async function sendR(m)
    {
      thiss.cs.sendRequest({index: m.index, arguments: m.arguments}).subscribe((r) => {
        console.log(r.result);
        m.result = r.result;
        m.completed = true;
        if(ar.length>0)
        {
          console.log(ar.length)
          sendR(ar.shift());
        }
      });
    }

    this.loadedModules.slice(1, -1).forEach(async (m) => {
      thiss = this;
      //await sendR(m);
      ar.push(m);
    });
    
    sendR(ar.shift());

  }
}