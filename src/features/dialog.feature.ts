import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {MyElements} from "../elements";

export type MessageTypes = 'message' | 'warning' | 'error';

export interface DialogMessage {

  message: string,
  type: MessageTypes

}

export const DialogFeature = {

  messages$: new Subject<DialogMessage>(),

  get messageElements$() {
      return this.messages$
        .pipe(
          map((message: DialogMessage) => {
              let messageElement = document.createElement('div');
              messageElement.innerText = message.message;
              messageElement.classList.add(message.type);

              return messageElement;
            }
          )
        );
  },

  init() {
    this.messages$
      .subscribe((message: DialogMessage) => {
        let messageElement = document.createElement('div');
        messageElement.innerText = message.message;
        messageElement.classList.add('dialog-message');
        messageElement.classList.add(message.type);

        messageElement.addEventListener("animationend", () => {
          messageElement.remove();
        });

        MyElements.dialogContainer.appendChild(messageElement);
      });
  }

};
