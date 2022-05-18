/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package com.mb.dna.kube.client.main;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.util.Config;
import io.minio.BucketExistsArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.Result;
import io.minio.messages.Item;

@SpringBootApplication
public class Application {

  private static String KUBEFLOW_NAMESPACE = "kubeflow";
	
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
    try {
		ApiClient client = Config.defaultClient();
		Configuration.setDefaultApiClient(client);
        CoreV1Api api = new CoreV1Api();
        V1PodList items = api.listNamespacedPod(KUBEFLOW_NAMESPACE,null, null, null, null, null, null, null, null, 10, false);
        V1Pod minioPod = items.getItems().stream().filter(pod -> pod.getMetadata().getName().contains("minio")).findFirst().get();
        V1PodSpec minioPodSpec = minioPod.getSpec();
        V1Container minioContainer = minioPodSpec.getContainers().stream().filter(container -> container.getName().contains("minio")).findFirst().get();
        minioContainer.getEnv().forEach(x -> System.out.println("Environment name: " + x.getName() + " , value: " + x.getValue()));
        
        String minioBaseUri = "";
        String minioAdminAccessKeySample = "minio";
    	String minioAdminSecretKeySample = "minio123";
    	MinioClient minioClient = null;
    	try {
    		minioBaseUri = minioPodSpec.getHostname();
    		System.out.println("hostname is : " + minioBaseUri);
    		minioClient = MinioClient.builder()
    		        .endpoint(minioBaseUri, 9000, true)
    		        .credentials(minioAdminAccessKeySample, minioAdminSecretKeySample)
    		        .build();
    	}catch(Exception e) {
    		minioBaseUri = "http://"+minioPodSpec.getHostname();
    		minioClient = MinioClient.builder()
		        .endpoint(minioBaseUri, 9000, true)
		        .credentials(minioAdminAccessKeySample, minioAdminSecretKeySample)
		        .build();
    	}
    	boolean found =
    			  minioClient.bucketExists(BucketExistsArgs.builder().bucket("models").build());
    			if (found) {
    				Iterable<Result<Item>> results = minioClient.listObjects(
    					    ListObjectsArgs.builder().bucket("models").recursive(true).build());
    				ObjectMapper mapper = new ObjectMapper();
    				System.out.println(mapper.writeValueAsString(results));
    			} else {
    			  System.out.println("my-bucketname does not exist");
    			}
    			
		V1Secret result = api.readNamespacedSecret("mlpipeline-minio-artifact", KUBEFLOW_NAMESPACE, "true" );
        System.out.println("Got results successfully");
        Map<String, byte[]> secretsMap = result.getData();
        for (String key: secretsMap.keySet()) {
            System.out.println(key + ": " + secretsMap.get(key));
        }
    	        
	}catch(Exception e) {
		e.printStackTrace();
	}
  }


}
