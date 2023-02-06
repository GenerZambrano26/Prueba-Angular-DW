import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value:any, arg: any): any {
const resulfil = [];

for (const post of value){
if(post.nom.indexOf(arg)>-1){
  resulfil.push(post);
}


};


    return resulfil;
  }

}
