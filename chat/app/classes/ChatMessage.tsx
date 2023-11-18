

class ChatMessage{
    public avatar: string;
    public messages: string;
    public role: string;

    constructor (avatar: string, messages: string, role: string){
        this.avatar = avatar;
        this.messages = messages;
        this.role = role;
    }
}

export default ChatMessage