/* LICENSE START
 * 
 * MIT License
 * 
 * Copyright (c) 2019 Daimler TSS GmbH
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * LICENSE END 
 */

package com.daimler.dna.airflow.app.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
	
	@Value("${swagger.headers.authorization.token}")
	private String defaultAuthToken;
	
	@Bean
	public Docket api() {

		ParameterBuilder contentTypeParamBuilder = new ParameterBuilder();
		contentTypeParamBuilder.name("Content-Type").modelRef(new ModelRef("string")).parameterType("header")
				.defaultValue("application/json").required(true).build();

		ParameterBuilder authHeader = new ParameterBuilder();
		authHeader.name("Authorization").description("Authorization header").modelRef(new ModelRef("string"))
				.parameterType("header")
				.defaultValue(
						defaultAuthToken)
				.required(true).build();
		List<Parameter> params = new ArrayList<>();
		params.add(contentTypeParamBuilder.build());
		params.add(authHeader.build());

		return new Docket(DocumentationType.SWAGGER_2).select()
				.apis(RequestHandlerSelectors.basePackage("com.daimler.dna.airflow.controller"))
				.paths(PathSelectors.regex("/.*")).build().apiInfo(apiEndPointsInfo())
				.globalOperationParameters(params);
	}

	private ApiInfo apiEndPointsInfo() {
		return new ApiInfoBuilder().title("Pipeline as a Service.").description(
				"REST API uri document management. Description of all the available APIs along with request and response formats. Also provides "
						+ " options to try calling to execute running APIs and check")
				.license("Daimler AG 2020").licenseUrl("https://github.com/Daimler/DnA/blob/master/LICENSE").version("0.0.1")
				.build();
	}

}