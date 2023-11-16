package com.daimler.data.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

public class MultipartFileConverter implements MultipartFile{

    private final String name;
    private final String originalFilename;
    private final String contentType;
    private final byte[] content;

    public MultipartFileConverter(String name, String originalFilename, String contentType, byte[] content) {
        this.name = name;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.content = content;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public String getOriginalFilename() {
        return this.originalFilename;
    }

    @Override
    public String getContentType() {
        return this.contentType;
    }

    @Override
    public boolean isEmpty() {
        return this.content.length == 0;
    }

    @Override
    public long getSize() {
        return this.content.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return this.content;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayResource(this.content).getInputStream();
    }

    @Override
    public void transferTo(java.nio.file.Path dest) throws IOException, IllegalStateException {
        throw new UnsupportedOperationException("This method is not supported");
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'transferTo'");
    }
    
}
