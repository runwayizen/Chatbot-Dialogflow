import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class Message { 
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {
  
  //TODO : Move this to constants file
  readonly detectIntentEndpoint = 
          "https://us-central1-newagent-8d402.cloudfunctions.net/detectTextIntent"; 

  conversation = new BehaviorSubject<Message[]>([]);
  constructor( public http: HttpClient) {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };  
    const request = {  
        "query": msg,
        "languageCode": "en-US"
    }  
    this.http.post(this.detectIntentEndpoint, request, httpOptions).subscribe(
      (data: any) =>{ //TODO create an interface for response structure
        console.log(data);
        if(data && !data.Error){
          const botMessage = new Message(data.fulfillmentText, 'bot');
          this.update(botMessage);
        }        
      },
      error => {
        //TODO: handle error graciously 
        console.log(error);
      }
    );
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }
}
