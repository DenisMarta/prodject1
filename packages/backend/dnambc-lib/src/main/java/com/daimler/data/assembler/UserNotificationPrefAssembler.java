package com.daimler.data.assembler;

import org.springframework.stereotype.Component;

import com.daimler.data.db.entities.UserNotificationPrefNsql;
import com.daimler.data.db.jsonb.NotificationPreference;
import com.daimler.data.db.jsonb.UserNotificationPreference;
import com.daimler.data.dto.usernotificationpref.NotificationPreferenceVO;
import com.daimler.data.dto.usernotificationpref.UserNotificationPrefVO;

@Component
public class UserNotificationPrefAssembler  implements GenericAssembler<UserNotificationPrefVO, UserNotificationPrefNsql> {

	@Override
	public UserNotificationPrefVO toVo(UserNotificationPrefNsql entity) {
		UserNotificationPrefVO vo = new UserNotificationPrefVO();
		if(entity != null) {
			vo.setId(entity.getId());
			UserNotificationPreference data = entity.getData();
			if(data!=null) {
				NotificationPreference notebookNotificationPrefJson = data.getNotebookNotificationPref();
				NotificationPreferenceVO notebookNotificationPrefVO = this.toNotificationPrefVO(notebookNotificationPrefJson);
				vo.setNotebookNotificationPref(notebookNotificationPrefVO);
				
				NotificationPreference solutionNotificationPrefJson = data.getSolutionNotificationPref();
				NotificationPreferenceVO solutionNotificationPrefVO = this.toNotificationPrefVO(solutionNotificationPrefJson);
				vo.setSolutionNotificationPref(solutionNotificationPrefVO);
				
				NotificationPreference persistenceNotificationPrefJson = data.getPersistenceNotificationPref();
				NotificationPreferenceVO persistenceNotificationPrefVO = this.toNotificationPrefVO(persistenceNotificationPrefJson);
				vo.setPersistenceNotificationPref(persistenceNotificationPrefVO);
				
				NotificationPreference dashboardNotificationPrefJson = data.getDashboardNotificationPref();
				NotificationPreferenceVO dashboarNotificationPrefVO = this.toNotificationPrefVO(dashboardNotificationPrefJson);
				vo.setDashboardNotificationPref(dashboarNotificationPrefVO);
				
				vo.setUserId(data.getUserId());
			}
		}
		return vo;
	}

	private NotificationPreferenceVO toNotificationPrefVO(NotificationPreference notificationPrefJson){
		
		NotificationPreferenceVO  vo = new NotificationPreferenceVO();
		if(notificationPrefJson!=null) {
			vo.setEnableAppNotifications(notificationPrefJson.isEnableAppNotifications());
			vo.setEnableEmailNotifications(notificationPrefJson.isEnableEmailNotifications());
		}else {
			vo.setEnableAppNotifications(true);
			vo.setEnableEmailNotifications(false);
		}
		return vo;
	}
	
	
	@Override
	public UserNotificationPrefNsql toEntity(UserNotificationPrefVO vo) {
		UserNotificationPrefNsql entity = new UserNotificationPrefNsql();
		UserNotificationPreference userNotificationPreferenceJsonb = new UserNotificationPreference();
		if(vo!=null) {
			userNotificationPreferenceJsonb.setUserId(vo.getUserId());
			NotificationPreference notebookPreference = this.toNotificationPrefJson(vo.getNotebookNotificationPref());
			userNotificationPreferenceJsonb.setNotebookNotificationPref(notebookPreference);
			NotificationPreference solutionPreference = this.toNotificationPrefJson(vo.getSolutionNotificationPref());
			userNotificationPreferenceJsonb.setSolutionNotificationPref(solutionPreference);
			NotificationPreference persistencePreference = this.toNotificationPrefJson(vo.getPersistenceNotificationPref());
			userNotificationPreferenceJsonb.setPersistenceNotificationPref(persistencePreference);
			NotificationPreference dashboardPreference = this.toNotificationPrefJson(vo.getDashboardNotificationPref());
			userNotificationPreferenceJsonb.setDashboardNotificationPref(dashboardPreference);
			entity.setId(vo.getId());
		}
		entity.setData(userNotificationPreferenceJsonb);
		return entity;
	}
	
	private NotificationPreference toNotificationPrefJson(NotificationPreferenceVO notificationPrefVO){
		
		NotificationPreference notificationPrefJson = new NotificationPreference();
		if(notificationPrefVO!=null) {
			notificationPrefJson.setEnableAppNotifications(notificationPrefVO.isEnableAppNotifications());
			notificationPrefJson.setEnableEmailNotifications(notificationPrefVO.isEnableEmailNotifications());
		}
		return notificationPrefJson;
	}

}