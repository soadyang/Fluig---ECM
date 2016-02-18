function displayFields(form, customHTML) {
	customHTML.append("<script>");
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(false);

	setEnabledConponent('btZoomColab', false);
	setEnabledConponent('busca_tipo', false);
	setEnabledConponent('re_busca_tipo', false);
	setEnabledConponent('bt_add_interacao', false);
	hideTableColumn("tb_interacao", 1, false);

	var numAtividade = getValue("WKNumState");	
	var matricula = getValue("WKUser");
	
	var filter = new java.util.HashMap();
	filter.put("colleaguePK.colleagueId", matricula);
	var dadosusuario = getDatasetValues('colleague', filter).get(0);
	
	var colaborador = dadosusuario.get("colleagueName");
	var ramal = dadosusuario.get("extensionNr");

	var today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());

	if (numAtividade == 0 || numAtividade == 1) {
		form.setValue('matricula_user', matricula);
		form.setValue('solicitante', colaborador);
		form.setValue('ramal', ramal);
		form.setValue('data_sol', today);
		form.setValue('chamado_num', getValue("WKNumProces"));
		
		setEnabledConponent('busca_tipo', true);
		setEnabledConponent('btZoomColab', validarGrupo(matricula, "TI"));		
	}

	if (numAtividade == 2 || numAtividade == 6) {
		form.setValue('matricula_atend', matricula);
		form.setValue('atendente', colaborador);
		form.setValue('chamado_num', getValue("WKNumProces"));
		
		setEnabledConponent('re_busca_tipo', true);
		setEnabledConponent('bt_add_interacao', true);
		hideTableColumn("tb_interacao", 1, true);
	}

	if (numAtividade == 3) {
		form.setValue('chamado_num', getValue("WKNumProces"));
	}

	if (numAtividade == 4) {
		form.setValue('chamado_num', getValue("WKNumProces"));
		form.setValue('matricula_aceite', matricula);
		form.setValue('user_aceite', colaborador);
		form.setValue('dt_final', today);
	}

	function setEnabledConponent(componente, lEnable) {		
		customHTML.append("$('#" + componente + "').attr('disabled', " + !lEnable + "); ");	
		if (lEnable == false) {
			customHTML.append("$('#" + componente + "').children('i').hide(); ");	
		} else {
			customHTML.append("$('#" + componente + "').children('i').show(); ");
		}		
	}

	function hideTableColumn(tabela, coluna, lEnable) {		
		if (lEnable == false) {
			customHTML.append("$('table#" + tabela + " tbody tr').children('td:nth-child(" + coluna + ")').hide(); ");
		} else {
			customHTML.append("$('table#" + tabela + " tbody tr').children('td:nth-child(" + coluna + ")').show(); ");
		}		
	}

	function validarGrupo(user, grupo) {
		var c1 = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", user, user, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", grupo, grupo, ConstraintType.MUST);
		var constraints = new Array(c1, c2);
		var datasetPrincipal = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);
		for (var j = 0; j < datasetPrincipal.rowsCount; j++) {
			if (datasetPrincipal.getValue(j, "colleagueGroupPK.groupId") == grupo) {
				return true;
			}
		}
		return false;
	}
	customHTML.append("</script>");
}


function enableFields(form) {

	setEnabled(form, false); // dasabilita todos os campos
	var numAtividade = getValue("WKNumState");

	if (numAtividade == 0 || numAtividade == 1) {
		form.setEnabled('matricula_user', true);
		form.setEnabled('solicitante', true);
		form.setEnabled('ramal', true);
		form.setEnabled('classe', true);
		form.setEnabled('tipo', true);
		form.setEnabled('criticidade', true);
		form.setEnabled('desc_chamado', true);
	}

	if ((numAtividade == 2 || numAtividade == 6)) {
		form.setEnabled('re_classe', true);
		form.setEnabled('re_tipo', true);
		
		form.setEnabled('desc_interacao', true);
		form.setEnabled('dt_intera', true);
	}

	if (numAtividade == 3) {
		form.setEnabled('desc_aceite', true);
		form.setEnabled('dt_aceite', true);
	}

	if (numAtividade == 4) {
		form.setEnabled('comentarios', true);
		form.setEnabled('nota', true);
	}

	function setEnabled(form, lEnable) {
		var hpForm = new java.util.HashMap();
		hpForm = form.getCardData();
		var it = hpForm.keySet().iterator();
		while (it.hasNext()) {
			var key = it.next();
			form.setEnabled(key, lEnable);
		}
	}

}

function validateForm(form) {
	var numAtividade = getValue("WKNumState");
	var erros = "";

	if (numAtividade == 0 || numAtividade == 1) {

		if (form.getValue("ramal") == "") {
			erros += " - [Informe o ramal do solicitante];\n";
		}		
		if (form.getValue("classe") == "") {
			erros += " - [Tipo / Classe do chamado];\n";
		}
		if (form.getValue("criticidade") == "") {
			erros += " - [Criticidade do chamado];\n";
		}
		if (form.getValue("desc_chamado") == "") {
			erros += " - [Descrição do chamado];\n";
		}
	}
	
	if ((numAtividade == 2 || numAtividade == 6)) {
		if (form.getValue("re_classe") == "") {
			erros += " - [Reclassificar Tipo / Classe do chamado];\n";
		}		
	}
	
	if (numAtividade == 4) {
		if (form.getValue("comentarios") == "") {
			if (form.getValue("nota") == "2" || form.getValue("nota") == "3") {
				erros += " - [Comente o motivo do não atendimento ou atendimento parcial];\n";
			}
		}		
	}

	if (erros != "") {
		throw "\nOs campos abaixo são de preenchimento obrigatório:\n" + erros;
	}
}