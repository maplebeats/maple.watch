package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	ping "github.com/go-ping/ping"
)

var (
	offset = int64(0)
)

func main() {
	fs := http.FileServer(http.Dir("../"))
	http.Handle("/", logHandler(fs))
	http.HandleFunc("/ping", PingHandle)

	port := "8080"
	if len(os.Args) > 1 {
		port = os.Args[1]
	}
	if len(os.Args) > 2 {
		off, err := strconv.Atoi(os.Args[2])
		if err == nil {
			offset = int64(off)
		}
	}

	log.Println("Listening on :" + port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func logHandler(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r)
		log.Println(r.RemoteAddr, r.Header)
	}
	return http.HandlerFunc(fn)
}

// PingHandle ping
func PingHandle(w http.ResponseWriter, req *http.Request) {
	q := req.URL.Query()
	host := q.Get("host")
	avg, err := PingHTTP(host)
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		w.Write([]byte(fmt.Sprintf(`{"code":1,"message":"%s"}`, err.Error())))
		return
	}
	w.Write([]byte(fmt.Sprintf(`{"code":0,"data":%d}`, avg-offset)))
	return
}

// PingHTTP ping http
func PingHTTP(url string) (int64, error) {
	var sub time.Duration
	//defer func() { log.Printf("ping %s %d", url, sub) }()
	begin := time.Now()
	http.Get("http://" + url)
	end := time.Now()
	sub = end.Sub(begin)
	return sub.Milliseconds(), nil
}

//PingIcmp ping host
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
