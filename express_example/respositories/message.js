import Message from '../models/messages';
import BaseRespository from './base'

export default class MessageRespository extends BaseRespository {
    constructor() {
        super(Message);
    }
}