import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Relationship {
  id: number;
  relationship_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private baseUrl = 'http://genology.local/api/dropdowns-data';

  constructor(private http: HttpClient) {}

  private fetchDropdownData<T>(endpoint: string): Observable<{ data: T[] }> {
    return this.http.get<{ data: T[] }>(`${this.baseUrl}/${endpoint}`);
  }

  getRelationshipTypes(): Observable<{ data: { id: number; relationship_type: string }[] }> {
    return this.fetchDropdownData<{ id: number; relationship_type: string }>('relationship');
  }

  getOccupationTypes(): Observable<{ data: { id: number; occupation_name: string }[] }> {
    return this.fetchDropdownData<{ id: number; occupation_name: string }>('occupation');
  }

  getMaritialStatusTypes(): Observable<{ data: { id: number; maritial_status: string }[] }> {
    return this.fetchDropdownData<{ id: number; maritial_status: string }>('maritialstatus');
  }

  getReligionTypes(): Observable<{ data: { id: number; religion_name: string }[] }> {
    return this.fetchDropdownData<{ id: number; religion_name: string }>('religion');
  }

  getStateTypes(): Observable<{ data: { id: number; state: string }[] }> {
    return this.fetchDropdownData<{ id: number; state: string }>('state');
  }

  getDistrictsByState(stateId: number): Observable<{ data: { id: number; district: string }[] }> {
    return this.http.get<{ data: { id: number; district: string }[] }>(`${this.baseUrl}/district?state_id=${stateId}`);
  }

  getCasteTypes(): Observable<{ data: { id: number; caste_name: string }[] }> {
    return this.fetchDropdownData<{ id: number; caste_name: string }>('caste');
  }


}
