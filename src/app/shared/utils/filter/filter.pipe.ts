import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(myArray: any[],searchText:string,fieldNames:string[],subFieldName:string=''): any[] {
    // return empty array if array is falsy
    if (!myArray) { return []; }

    // return the original array if search text is empty
    if (!searchText) { return myArray; }

    // convert the searchText to lower case
    searchText = searchText.toLowerCase();

    // retrun the filtered array
    return myArray.filter(item => {
      for (const fieldName of fieldNames) {
        let fieldValue: any;

        // Handle nested fields if subFieldName is specified
        if (subFieldName !== '') {
          fieldValue = item[fieldName] ? item[fieldName][subFieldName] : null;
        } else {
          fieldValue = item[fieldName];
        }

        if (fieldValue && fieldValue.toString().toLowerCase().includes(searchText)) {
          return true; // Return true if the searchText is found in any of the specified columns
        }
      }

      return false; // Return false if the searchText is not found in any of the specified columns
    });
  }

}
