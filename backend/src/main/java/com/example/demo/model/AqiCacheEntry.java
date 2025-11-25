package com.example.demo.model;

public class AqiCacheEntry {
    private Object data;
    private long timestamp;

    public AqiCacheEntry(Object data, long timestamp) {
        this.data = data;
        this.timestamp = timestamp;
    }

    public Object getData() {
        return data;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
