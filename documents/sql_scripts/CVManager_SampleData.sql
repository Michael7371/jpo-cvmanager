-- Sample data to test CV Manager locally or in a new deployment
-- This is only recommended to be used for testing, do not use in a deployed environment
INSERT INTO public.manufacturers(name) 
  VALUES ('Kapsch'), ('Commsignia'), ('Yunex');

INSERT INTO public.rsu_models(
	name, supported_radio, manufacturer)
	VALUES ('RIS-9260', 'DSRC,C-V2X', 1), ('ITS-RS4-M', 'DSRC,C-V2X', 2), ('RSU2X US', 'DSRC,C-V2X', 3);

INSERT INTO public.rsu_credentials(
	username, password, nickname)
	VALUES ('username', 'password', 'cred1');

INSERT INTO public.snmp_credentials(
	username, password, nickname)
	VALUES ('username', 'password', 'snmp1');

INSERT INTO public.rsus(
	geography, milepost, ipv4_address, serial_number, primary_route, model, credential_id, snmp_credential_id, iss_scms_id)
	VALUES (ST_GeomFromText('POINT(-105.014182 39.740422)'), 1, '10.0.0.1', 'E5672', 'I999', 2, 1, 1, 'E5672');

INSERT INTO public.organizations(
	name)
	VALUES ('Test Org');

INSERT INTO public.roles(
	name)
	VALUES ('admin'), ('operator'), ('user');

INSERT INTO public.rsu_organization(
	rsu_id, organization_id)
	VALUES (1, 1);

-- Replace user with a real gmail to test GCP OAuth2.0 support
INSERT INTO public.users(
	email, first_name, last_name, super_user)
	VALUES ('test@gmail.com', 'Test', 'User', '1');

INSERT INTO public.user_organization(
	user_id, organization_id, role_id)
	VALUES (1, 1, 1);