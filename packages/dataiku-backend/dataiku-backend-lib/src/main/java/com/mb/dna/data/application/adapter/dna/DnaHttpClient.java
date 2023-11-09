package com.mb.dna.data.application.adapter.dna;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.client.HttpClient;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import lombok.extern.slf4j.Slf4j;

@Singleton
@Slf4j
public class DnaHttpClient {

	@Inject
	HttpClient client;

	@Inject
	DnaClientConfig dnaClientConfig;
	
	public UserInfo verifyLogin(String userinfo) {
		UserInfo userInfo = null;
		VerifyLoginResponseDto responseBody = null;
		String url =  dnaClientConfig.getUri() + dnaClientConfig.getVerifyLoginUri();
		log.info("Dna verify login with  {}", url);
		try {
			HttpRequest<?> req = HttpRequest.POST(url, null).header("Accept", "application/json")
			.header("Content-Type", "application/json")
			.header("dna-request-userdetails", userinfo);
			HttpResponse<VerifyLoginResponseDto> response = client.toBlocking().exchange(req,VerifyLoginResponseDto.class);
			if(response!=null && response.getBody()!=null) {
				responseBody = response.getBody().get();
			}
			if(responseBody!=null && responseBody.getData()!=null) {
				userInfo = responseBody.getData();
				log.info("logged in user is {}",userInfo.getId());
			}
		}catch(Exception e) {
			log.error("Failed to verify User login with exception {} ",e.getMessage());
		}
		return userInfo;
	}
}
