import UserRespository from './user'
import MessageRespository from './message'

module.exports = {
    userRespository: new UserRespository(),
    messageRespository: new MessageRespository()
}