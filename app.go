package main

import (
	"archive/zip"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type Painting struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Artist string `json:"artist"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
	Data   string `json:"data"`
}

type Pack struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	Paintings []Painting `json:"paintings"`
}

type Mcmeta struct {
	Pack struct {
		PackFormat  int    `json:"pack_format"`
		Description string `json:"description"`
	} `json:"pack"`
}

func (a *App) SelectZipFile() string {
	zipFile, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title:   "Select a zip file",
		Filters: []runtime.FileFilter{{DisplayName: "Zip Files", Pattern: "*.zip"}},
	})
	if err != nil {
		return err.Error()
	}

	archive, err := zip.OpenReader(zipFile)
	defer archive.Close()

	paintingIds := []string{}
	paintingMap := make(map[string]Painting)
	paintingRegex := regexp.MustCompile(`painting/\w+\.png$`)

	for _, f := range archive.File {
		if f.FileInfo().IsDir() {
			continue
		}

		fileFromArchive, _ := f.Open()
		bytes, _ := ioutil.ReadAll(fileFromArchive)

		if f.Name == "custompaintings.json" {
			var pack Pack
			json.Unmarshal(bytes, &pack)
			runtime.EventsEmit(a.ctx, "setId", pack.ID)
			runtime.EventsEmit(a.ctx, "setName", pack.Name)
			for _, painting := range pack.Paintings {
				if entry, ok := paintingMap[painting.ID]; ok {
					painting.Data = entry.Data
				}
				paintingIds = append(paintingIds, painting.ID)
				paintingMap[painting.ID] = painting
			}
		} else if f.Name == "pack.mcmeta" {
			var mcmeta Mcmeta
			json.Unmarshal(bytes, &mcmeta)
			runtime.EventsEmit(a.ctx, "setPackFormat", mcmeta.Pack.PackFormat)
			runtime.EventsEmit(a.ctx, "setDescription", mcmeta.Pack.Description)
		} else if f.Name == "pack.png" {
			encoded := "data:image/png;base64," + base64.StdEncoding.EncodeToString(bytes)
			runtime.EventsEmit(a.ctx, "setIcon", encoded)
		} else if paintingRegex.MatchString(f.Name) {
			paintingId := f.Name[strings.LastIndex(f.Name, "/")+1 : strings.LastIndex(f.Name, ".")]

			if _, ok := paintingMap[paintingId]; !ok {
				paintingIds = append(paintingIds, paintingId)
				paintingMap[paintingId] = Painting{ID: paintingId}
			}

			if entry, ok := paintingMap[paintingId]; ok {
				encoded := "data:image/png;base64," + base64.StdEncoding.EncodeToString(bytes)
				entry.Data = encoded
				paintingMap[paintingId] = entry
			}
		}

		fileFromArchive.Close()
	}

	paintings := []Painting{}
	for _, id := range paintingIds {
		paintings = append(paintings, paintingMap[id])
	}

	runtime.EventsEmit(a.ctx, "setPaintings", paintings)

	return zipFile
}
