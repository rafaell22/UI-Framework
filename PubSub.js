function PubSub() {
    this.events = {};
}

PubSub.prototype.subscribe = function(event, callback) {
    if(!this.events[event]) {
        this.events[event] = [];
    }
    const id = this.events[event].length + (new Date()).toISOString();
    this.events[event].push({
        id: id,
        callback: callback
    });
    
    return id;
}

PubSub.prototype.publish = function(event, args = []) {
    if(this.events[event]) {
        this.events[event].forEach(listener => {
            listener.callback(...args);
        });
    }
}

PubSub.prototype.unsubscribe = function(id) {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if(eventIndex >= 0) {
        events.splice(eventIndex, 1);
    }
}