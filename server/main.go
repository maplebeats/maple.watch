package main

import (
	"fmt"
	"log"
	"net/http"

	ping "github.com/go-ping/ping"
)

func main() {
	fs := http.FileServer(http.Dir("../"))
	http.Handle("/", fs)
	http.HandleFunc("/ping", PingHandle)

	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

// PingHandle ping
func PingHandle(w http.ResponseWriter, req *http.Request) {
	q := req.URL.Query()
	host := q.Get("host")
	avg, err := Ping(host)
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		w.Write([]byte(fmt.Sprintf(`{"code":1,"message":"%s"}`, err.Error())))
		return
	}
	w.Write([]byte(fmt.Sprintf(`{"code":0,"data":%d}`, avg)))
}

//Ping ping host
func PingIcmp(host string) (int64, error) {
	var err error
	var pinger *ping.Pinger
	var stats *ping.Statistics
	defer func() { log.Printf("ping %s %v %v", host, stats, err) }()
	pinger, err = ping.NewPinger(host)
	if err != nil {
		return 0, err
	}
	pinger.Count = 3
	err = pinger.Run()
	if err != nil {
		return 0, err
	}
	stats = pinger.Statistics()
	return stats.AvgRtt.Milliseconds(), nil
}
