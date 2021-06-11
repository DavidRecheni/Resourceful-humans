
export default class SWAPI {

    constructor(apiUrl) {
        this.url = apiUrl
        this.cache = {}
    }


    getData(setter) {
        const formatData = (unformatedData) => {

            const planets = unformatedData.allPlanets.planets.map(p => {
                return { id: p.name, group: 2 }
            })

            const films = unformatedData.allFilms.films.map(f => {
                return { id: f.title, group: 1 }
            })

            const isolatedPlanetsLinks = () => {
                const links = []
                const islatedPlanets = unformatedData.allPlanets.planets.filter(p => !p.filmConnection.films.length)

                // Compare every planet with each other and push the links into links arr, except for the ones that already exist
                islatedPlanets.forEach(p => {
                    islatedPlanets.forEach(p2 => {
                        if (p !== p2) {
                            links.push({ source: p.name, target: p2.name })
                        }
                    })

                })

                return links
            }

            const links = unformatedData.allPlanets.planets
                .filter(p => p.filmConnection.films.length)
                .map(p => p.filmConnection.films
                    .map(f => {
                        return { source: p.name, target: f.title }
                    }))

            return {
                nodes: [...films,
                ...planets
                ],
                links: [...links.flat(), ...isolatedPlanetsLinks()]
            }
        }

        if (!this.cache.nodes) {
            console.log('Cache empty, Fetching data')
            fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: `{
                        allFilms {
                          films {
                            title
                          }
                        }
                        allPlanets {
                          planets {
                            name,
                            filmConnection{
                              films{
                                title
                              }
                            }
                          }
                        }
                      }`
                })
            })
                .then(r => r.json())
                .then(r => {
                    const data = formatData(r.data)
                    setter(data)
                    this.cache = data
                })
        } else {
            console.log('Response from cache!')
            setter(this.cache)
        }
    }


    updateNodes(pendingNodes, data) {
        if (pendingNodes.replace.length) {
            let modifiedLinks = data.links.map(link => {
                pendingNodes.replace.forEach((pn, i) => {
                    if (pn.oldId === link.source.id) {
                        link.source.id = pn.newId
                    } else if (pn.oldId === link.target.id) {
                        link.target.id = pn.newId
                    }
                })
                return link
            })

            return { nodes: [...data.nodes, ...pendingNodes.nodes], links: [...modifiedLinks, ...pendingNodes.links] }

        } else return { nodes: [...data.nodes, ...pendingNodes.nodes], links: [...data.links, ...pendingNodes.links] }
    }

}