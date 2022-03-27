{
scorecards=`wget -qO- http://127.0.0.1:8000/cka/fixtures/played`
season='2019'
upload_dir='/cygdrive/d/Mark/CKAWebSite/Upload'
echo $scorecards

wget -O ${upload_dir}/fixtures.json http://127.0.0.1:8000/cka/fixtures.json
wget -O ${upload_dir}/teams.json http://127.0.0.1:8000/cka/teams.json
wget -O ${upload_dir}/matches.json http://127.0.0.1:8000/cka/matches.json
wget -O ${upload_dir}/venues.json http://127.0.0.1:8000/cka/venues.json
wget -O ${upload_dir}/player_statistics.json http://127.0.0.1:8000/cka/player_statistics.json
wget -O ${upload_dir}/players.json http://127.0.0.1:8000/cka/players.json
wget -O ${upload_dir}/clubs.json http://127.0.0.1:8000/cka/clubs.json
wget -O ${upload_dir}/league_tables.json http://127.0.0.1:8000/cka/league_tables.json

wget -O ${upload_dir}/FixtureList.htm http://127.0.0.1:8000/cka/fixtures 

wget -O ${upload_dir}/Division1.htm http://127.0.0.1:8000/cka/division/1 
wget -O ${upload_dir}/Division2.htm http://127.0.0.1:8000/cka/division/2 
wget -O ${upload_dir}/Division3.htm http://127.0.0.1:8000/cka/division/3 


wget -O ${upload_dir}/Stats1.htm http://127.0.0.1:8000/cka/division/scorers/1 
wget -O ${upload_dir}/Stats2.htm http://127.0.0.1:8000/cka/division/scorers/2 
wget -O ${upload_dir}/Stats3.htm http://127.0.0.1:8000/cka/division/scorers/3 
wget -O ${upload_dir}/Stats-1.htm http://127.0.0.1:8000/cka/division/scorers/SERL
wget -O ${upload_dir}/Stats0.htm http://127.0.0.1:8000/cka/division/scorers/NL

wget -O ${upload_dir}/status.html http://127.0.0.1:8000/cka/player/status 


#TIG2TIG1 PHO2PHO3 CIT2TIG3 TIG5TIG4 CIT4CIT5 VIK4VIK3 LIT2VIK2 TIG4CIT4 TIG3UNI1 CIT3CIT2 TIG0ICE1 PHO0KWV2 BEA2VIK0 KIN2VIK0 PHO3CIT3 VIK1CIT1 LIT2PHO2 CIT2VIK2 CIT5VIK4 PHO0CIT0 UNI2TIG5

for res in $scorecards
do
	wget -O ${upload_dir}/${res}.htm http://127.0.0.1:8000/cka/results/Upload/${res}.htm
	wget -O ${upload_dir}/${res}_int.htm http://127.0.0.1:8000/cka/results/Upload/${res}_int.htm
done

for team in CIT0 CIT1 CIT2 CIT3 CIT4 CIT5 LIT1 LIT2 LIT3 PHO0 PHO1 PHO2 PHO3 PHO4 TIGNL TIG0 TIG1 TIG2 TIG3 TIG4 TIG5 UNI1 UNI2 VIK0 VIK1 VIK2 VIK3 VIK4
do
	wget -O ${upload_dir}/${team}.htm http://127.0.0.1:8000/cka/season/${team}
done

echo "Fixing paths"
cd ${upload_dir}

echo "Fixing static"
sed -i 's|\/static\/ckaleague\/||g' *.htm *.html

echo "Fixing results path Division"
sed -i 's|cka\/results\/||g' Division?.htm

echo "Fixing results path Fixtures"
sed -i 's|cka\/results\/||g' FixtureList.htm 

echo "FETCHING STATUS"

echo "Check wget_all.log file for any errors"

} 2>&1 | tee wget_all.log
