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

package com.daimler.data.db.repo.workspace;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import com.daimler.data.controller.exceptions.GenericMessage;
import com.daimler.data.controller.exceptions.MessageDescription;
import com.daimler.data.db.entities.CodeServerWorkspaceNsql;
import com.daimler.data.db.json.CodeServerDeploymentDetails;
import com.daimler.data.db.repo.common.CommonDataRepositoryImpl;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class WorkspaceCustomRepositoryImpl extends CommonDataRepositoryImpl<CodeServerWorkspaceNsql, String>
		implements WorkspaceCustomRepository {

	
	@Override
	public List<CodeServerWorkspaceNsql> findAll(String userId, int limit, int offset) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<CodeServerWorkspaceNsql> cq = cb.createQuery(CodeServerWorkspaceNsql.class);
		Root<CodeServerWorkspaceNsql> root = cq.from(entityClass);
		CriteriaQuery<CodeServerWorkspaceNsql> getAll = cq.select(root);
		Predicate p1 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("workspaceOwner"), cb.literal("id"))),
				userId.toLowerCase());
		Predicate p2 = cb.notEqual(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("status"))),
				"DELETED".toLowerCase());
		Predicate pMain = cb.and(p1,p2);
		cq.where(pMain);
		TypedQuery<CodeServerWorkspaceNsql> getAllQuery = em.createQuery(getAll);
		if (offset >= 0)
			getAllQuery.setFirstResult(offset);
		if (limit > 0)
			getAllQuery.setMaxResults(limit);
		return getAllQuery.getResultList();
	}

	@Override
	public Integer getCount(String userId) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<CodeServerWorkspaceNsql> root = cq.from(CodeServerWorkspaceNsql.class);
		CriteriaQuery<Long> getAll = cq.select(cb.count(root));
		Predicate p1 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("workspaceOwner"), cb.literal("id"))),
				userId.toLowerCase());
		Predicate p2 = cb.notEqual(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("status"))),
				"DELETED".toLowerCase());
		Predicate pMain = cb.and(p1,p2);
		cq.where(pMain);
		TypedQuery<Long> getAllQuery = em.createQuery(getAll);
		Long count = getAllQuery.getSingleResult();
		return Integer.valueOf(count.intValue());
	}

	@Override
	public CodeServerWorkspaceNsql findbyProjectName(String userId, String projectName) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<CodeServerWorkspaceNsql> cq = cb.createQuery(CodeServerWorkspaceNsql.class);
		Root<CodeServerWorkspaceNsql> root = cq.from(entityClass);
		CriteriaQuery<CodeServerWorkspaceNsql> byName = cq.select(root);
		Predicate con1 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("projectDetails"), cb.literal("projectName"))),
				projectName.toLowerCase());
		Predicate con2 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("workspaceOwner"), cb.literal("id"))),
				userId.toLowerCase());
		Predicate con3 = cb.notEqual(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("status"))),
				"DELETED".toLowerCase());
		Predicate pMain = cb.and(con1, con2, con3);
		cq.where(pMain);
		TypedQuery<CodeServerWorkspaceNsql> byNameQuery = em.createQuery(byName);
		List<CodeServerWorkspaceNsql> entities = byNameQuery.getResultList();
		if (entities != null && entities.size() > 0)
			return entities.get(0);
		else
			return null;
	}
	
	@Override
	public CodeServerWorkspaceNsql findbyUniqueLiteral(String userId, String uniqueLiteral, String value) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<CodeServerWorkspaceNsql> cq = cb.createQuery(CodeServerWorkspaceNsql.class);
		Root<CodeServerWorkspaceNsql> root = cq.from(entityClass);
		CriteriaQuery<CodeServerWorkspaceNsql> byName = cq.select(root);
		Predicate con1 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal(uniqueLiteral))),
				value.toLowerCase());
		Predicate con2 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("workspaceOwner"), cb.literal("id"))),
				userId.toLowerCase());
		Predicate con3 = cb.notEqual(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("status"))),
				"DELETED".toLowerCase());
		Predicate pMain = cb.and(con1, con2, con3);
		cq.where(pMain);
		TypedQuery<CodeServerWorkspaceNsql> byNameQuery = em.createQuery(byName);
		List<CodeServerWorkspaceNsql> entities = byNameQuery.getResultList();
		if (entities != null && entities.size() > 0)
			return entities.get(0);
		else
			return null;
	}

	@Override
	public CodeServerWorkspaceNsql findById(String userId, String id) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<CodeServerWorkspaceNsql> cq = cb.createQuery(CodeServerWorkspaceNsql.class);
		Root<CodeServerWorkspaceNsql> root = cq.from(entityClass);
		CriteriaQuery<CodeServerWorkspaceNsql> byName = cq.select(root);
		Predicate con1 = cb.equal(root.get("id"),id);
		Predicate con2 = cb.equal(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("workspaceOwner"), cb.literal("id"))),
				userId.toLowerCase());
		Predicate con3 = cb.notEqual(cb.lower(
				cb.function("jsonb_extract_path_text", String.class, root.get("data"), cb.literal("status"))),
				"DELETED".toLowerCase());
		Predicate pMain = cb.and(con1, con2, con3);
		cq.where(pMain);
		cq.orderBy(cb.desc(cb.function("jsonb_extract_path_text", Date.class, root.get("data"), cb.literal("intiatedOn"))));
		TypedQuery<CodeServerWorkspaceNsql> byNameQuery = em.createQuery(byName);
		List<CodeServerWorkspaceNsql> entities = byNameQuery.getResultList();
		if (entities != null && entities.size() > 0)
			return entities.get(0);
		else
			return null;
	}

	@Override
	public GenericMessage updateDeploymentDetails(String projectName, String environment, CodeServerDeploymentDetails deploymentDetails) {
		GenericMessage updateResponse = new GenericMessage();
		updateResponse.setSuccess("FAILED");
		List<MessageDescription> errors = new ArrayList<>();
		List<MessageDescription> warnings = new ArrayList<>();
		Date deployedOn = deploymentDetails.getLastDeployedOn();
		String longdate = "";
		if(deployedOn!=null)
			longdate = String.valueOf(deployedOn.getTime());
		String updateQuery = "update workspace_nsql\r\n"
				+ "set data = jsonb_set(data,'{projectDetails,"+ environment  +"}', \r\n"
						+ "'{\"deploymentUrl\": \""+ deploymentDetails.getDeploymentUrl() +"\","
						+ " \"lastDeployedBy\": {\"id\": \""+ deploymentDetails.getLastDeployedBy().getId()  + "\","
								+ " \"email\": \""+ deploymentDetails.getLastDeployedBy().getEmail()  + "\","
								+ " \"lastName\": \""+ deploymentDetails.getLastDeployedBy().getLastName() + "\","
								+ " \"firstName\": \""+ deploymentDetails.getLastDeployedBy().getFirstName()  + "\","
								+ " \"department\": \""+ deploymentDetails.getLastDeployedBy().getDepartment()  + "\","
								+ " \"gitUserName\": \""+ deploymentDetails.getLastDeployedBy().getGitUserName()  + "\","
								+ " \"mobileNumber\": \""+ deploymentDetails.getLastDeployedBy().getMobileNumber()  + "\"},"
						+ " \"lastDeployedOn\":" +   longdate + ","
						+ " \"lastDeployedBranch\": \""+ deploymentDetails.getLastDeployedBranch() +"\","
						+ " \"lastDeploymentStatus\": \""+ deploymentDetails.getLastDeploymentStatus() +"\"}')\r\n"
				+ "where data->'projectDetails'->>'projectName' = '"+projectName+"'";
		try {
			Query q = em.createNativeQuery(updateQuery);
			q.executeUpdate();
			updateResponse.setSuccess("SUCCESS");
			updateResponse.setErrors(new ArrayList<>());
			updateResponse.setWarnings(new ArrayList<>());
			log.info("deployment details updated successfully for project {} ", projectName);
		}catch(Exception e) {
			MessageDescription errMsg = new MessageDescription("Failed while updating deployment details.");
			errors.add(errMsg);
			log.info("deployment details updated successfully for project {} and environment {} , branch {} ", projectName,environment,deploymentDetails.getLastDeployedBranch());
		}
		return updateResponse;
	}
	
	
}
