// Usage: PHISHNET_API_KEY=your_key go run examples/go.go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type setlistRow struct {
	Set       string `json:"set"`
	Song      string `json:"song"`
	TransMark string `json:"trans_mark"`
}

func main() {
	req, _ := http.NewRequest("GET", "https://api.phish.net/v5/setlists/showdate/1997-11-22.json", nil)
	req.Header.Set("X-API-KEY", os.Getenv("PHISHNET_API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		log.Fatalf("request failed: %s", res.Status)
	}

	var body struct {
		Data []setlistRow `json:"data"`
	}
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		log.Fatal(err)
	}
	for _, r := range body.Data {
		fmt.Printf("Set %s: %s%s\n", r.Set, r.Song, r.TransMark)
	}
}
