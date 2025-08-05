/**
 * Notes: 钉钉审批集成
 * Date: 2024-02-23 07:48:00
 */

const BaseProjectService = require('./base_project_service.js');
const axios = require('axios');

class DingTalkService extends BaseProjectService {

	constructor() {
		super();
		this._token = process.env.DINGTALK_TOKEN || '';
		this._processCode = process.env.DINGTALK_PROCESS_CODE || '';
		this._deptId = process.env.DINGTALK_DEPT_ID || '';
	}

	async createApproval({ originatorUserId, formComponentValues }) {
		if (!this._token) return {};
		let url = 'https://oapi.dingtalk.com/topapi/processinstance/create?access_token=' + this._token;
		let body = {
				process_code: this._processCode,
				originator_user_id: originatorUserId,
				dept_id: this._deptId,
				form_component_values: formComponentValues
		};
		let res = await axios.post(url, body);
		return res.data || {};
	}
	
	async updateApprovalStatus(processInstanceId, approved) {
		if (!this._token || !processInstanceId) return {};
		let url = 'https://oapi.dingtalk.com/topapi/processinstance/finish?access_token=' + this._token;
		let body = {
				process_instance_id: processInstanceId,
				result: approved ? 'agree' : 'refuse'
			};
		try {
				let res = await axios.post(url, body);
				return res.data || {};
			} catch (err) {
				console.error('[DingTalk] updateApprovalStatus', err);
				return {};
		}
	}
}

module.exports = DingTalkService;

