import fs from "fs";

function process_csv(csvFileName) {
  const csv = fs.readFileSync(csvFileName, "utf8");
  const lines = csv.split("\n");

  const headers = lines.shift().split(",");

  return lines.map((line) => {
    const data = line.split(",");

    return data.reduce((map, data, index) => {
      map[headers[index]] = data;
      return map;
    }, {});
  });
}

function init_aggregation() {
  return {
    name: "",
    tournament_count: 0,
    match_count: 0,
    // acclamation_count: 0,
    total_count: 0,
    years: [],
  };
}

function aggregate_acclamation_data(acclamation_data) {}
function aggregate_match_data(aggregation, match_data) {
  return match_data.reduce((aggregation, match_data) => {
    const winner = match_data.Winner;

    if (!aggregation[winner]) aggregation[winner] = init_aggregation();

    aggregation[winner].name = winner;
    aggregation[winner].years = [...aggregation[winner].years, match_data.Year];
    aggregation[winner].match_count++;
    aggregation[winner].total_count++;
    return aggregation;
  }, aggregation);
}
function aggregate_tournament_data(aggregation, tournaments_data) {
  return tournaments_data.reduce((aggregation, tournament_data) => {
    const year = tournament_data.Year;
    const regex = /(\w+\s)*\w+/g;
    const winners = tournament_data.Winner.match(regex);

    return winners.reduce((aggregation, winner) => {
      if (!aggregation[winner]) aggregation[winner] = init_aggregation();

      aggregation[winner].name = winner;
      aggregation[winner].years = [
        ...aggregation[winner].years,
        tournament_data.Year,
      ];
      aggregation[winner].tournament_count++;
      aggregation[winner].total_count++;
      return aggregation;
    }, aggregation);
  }, aggregation);
}

function player_statistics_csv() {
  const acclamation_data = process_csv("./data/acclamation.csv");
  const match_data = process_csv("./data/match.csv");
  const tournament_data = process_csv("./data/tournament.csv");

  let aggregations = aggregate_match_data({}, match_data);
  aggregations = aggregate_tournament_data(aggregations, tournament_data);

  return aggregations;
}

function objects_to_csv(objects) {
  const headers = Object.keys(objects[0]);

  const lines = objects.map((obj) => {
    obj.years = obj.years.join(" ");
    return headers.map((header) => obj[header]).join(",");
  });
  return `${headers.join(",")}\n${lines.join("\n")}`;
}

console.log(objects_to_csv(Object.values(player_statistics_csv())));
