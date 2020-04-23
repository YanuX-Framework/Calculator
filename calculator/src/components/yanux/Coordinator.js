import './Coordinator.css'
import React from 'react'
import ReactModal from 'react-modal'

export default class Coordinator extends React.Component {

    constructor(props) {
        super(props)
        this.state = { alert: { title: 'Alert', message: 'Message', show: false } }

        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)

        this.resourcesSubscriptionHandler = this.resourcesSubscriptionHandler.bind(this)
        this.resourceSubscriptionHandler = this.resourceSubscriptionHandler.bind(this)
        this.proxemicsSubscriptionHandler = this.proxemicsSubscriptionHandler.bind(this)
        this.instancesSubscriptionHandler = this.instancesSubscriptionHandler.bind(this)
        this.eventsSubcriptionHandler = this.eventsSubcriptionHandler.bind(this)
        this.reconnectSubscriptionHandler = this.reconnectSubscriptionHandler.bind(this)

        this.resourceManagementRef = React.createRef();
        this.resourceSelected = this.resourceSelected.bind(this)
        this.createResource = this.createResource.bind(this)
        this.shareResource = this.shareResource.bind(this)
        this.deleteResource = this.deleteResource.bind(this)

        this.componentsDistributionRef = React.createRef()
        this.updatedComponentsDistribution = this.updatedComponentsDistribution.bind(this)
        this.resetAutoComponentsDistribution = this.resetAutoComponentsDistribution.bind(this)
    }

    componentDidUpdate(prevProps) {
        const coordinator = this.props.coordinator
        if (coordinator && !prevProps.coordinator) {
            coordinator.init().then(results => {
                const [initialState, initialProxemics] = results
                console.log('[YXC] Connected to YanuX Broker')
                console.log('[YXC] Initial State', initialState)
                console.log('[YXC] Initial Proxemics', initialProxemics)
                this.resourceSubscriptionHandler(initialState)
                this.props.connected(initialState, initialProxemics)
                this.updateResources()
                this.updateComponents()
            }).catch(err => {
                console.error('[YXC] Error Connecting to YanuX Broker', err)
                this.props.logout()
            })
            coordinator.subscribeResources(this.resourcesSubscriptionHandler)
            coordinator.subscribeResource(this.resourceSubscriptionHandler)
            coordinator.subscribeProxemics(this.proxemicsSubscriptionHandler)
            coordinator.subscribeInstances(this.instancesSubscriptionHandler)
            coordinator.subscribeEvents(this.eventsSubcriptionHandler)
            coordinator.subscribeReconnects(this.reconnectSubscriptionHandler)
        }

        if (this.resourceManagementRef.current) {
            this.resourceManagementRef.current.addEventListener(
                'resource-selected',
                this.resourceSelected
            )
            this.resourceManagementRef.current.addEventListener(
                'create-resource',
                this.createResource
            )
            this.resourceManagementRef.current.addEventListener(
                'share-resource',
                this.shareResource
            )
            this.resourceManagementRef.current.addEventListener(
                'delete-resource',
                this.deleteResource
            )
        }

        if (this.componentsDistributionRef.current) {
            this.componentsDistributionRef.current.addEventListener(
                'updated-components-distribution',
                this.updatedComponentsDistribution
            )
            this.componentsDistributionRef.current.addEventListener(
                'reset-auto-components-distribution',
                this.resetAutoComponentsDistribution
            )
        }
    }

    componentWillUnmount() {
        if (this.componentsDistributionRef.current) {
            this.componentsDistributionRef.current.removeEventListener(
                'updated-components-distribution',
                this.updatedComponentsDistribution
            )
            this.componentsDistributionRef.current.removeEventListener(
                'reset-auto-components-distribution',
                this.resetAutoComponentsDistribution
            )
        }
    }

    render() {
        if (!this.props.isCoordinatorReady) {
            return (
                <div className="overlay">
                    {this.props.idToken ? <div className="text">Loading</div> : null}
                </div>
            )
        } else {
            return (
                <React.Fragment>
                    <div className="resource-management">
                        <yanux-resource-management
                            ref={this.resourceManagementRef}
                            resourceId={this.props.resourceId || this.props.coordinator.resource.id}
                            resources={JSON.stringify(this.props.resources)} />
                    </div>
                    <div className="components-distribution">
                        <yanux-components-distribution
                            ref={this.componentsDistributionRef}
                            instanceId={this.props.coordinator.instance.id}
                            componentsDistribution={JSON.stringify(this.props.instancesComponentsDistribution)} />
                    </div>
                    <div className="alert">
                        <ReactModal
                            isOpen={this.state.alert.show}
                            contentLabel="Alert Dialog"
                            onRequestClose={this.handleCloseModal}
                            className="alert-content">
                            <h3>{this.state.alert.title}</h3>
                            <p>{this.state.alert.message}</p>
                            <button className="alert-button" onClick={this.handleCloseModal}>OK</button>
                        </ReactModal>
                    </div>
                </React.Fragment>
            )
        }
    }

    handleOpenModal(newTitle, newMessage) {
        const title = newTitle || this.state.alert.title
        const message = newMessage || this.state.alert.message
        this.setState({ alert: { title, message, show: true } })
    }

    handleCloseModal() {
        this.setState({ alert: { show: false } })
    }

    updateResources() {
        const coordinator = this.props.coordinator
        if (coordinator) {
            coordinator.getResources()
                .then(resources => {
                    console.log('[YXCRM] YanuX Coordinator Resources:', resources)
                    this.props.resourcesRetrieved(resources)
                }).catch(err => console.log('[YXCRM] Error getting resources:', err))
        }
    }

    updateState(data) {
        if (this.props.expression !== data.expression ||
            this.props.total !== data.total) {
            console.log(
                '[YXC] Props Expression:', this.props.expression,
                'Data Expression:', data.expression,
                'Props Total:', this.props.total,
                'Data Total:', data.total
            )
            this.props.setValues(data.expression, data.total)
        }
    }

    updateComponents(instance = null) {
        const coordinator = this.props.coordinator
        const componentsRuleEngine = this.props.componentsRuleEngine
        if (coordinator) {
            coordinator.getActiveInstances().then(activeInstances => {
                if (instance && instance.componentsDistribution && instance.componentsDistribution.auto === false) {
                    //TODO:
                    //I should probably find a way to make this pattern something that is "promoted" by the library/framework itself. 
                    //At the very least I should "virtually" rename "_id" to "id".
                    //I will probably just make a "blind" copy of "_id" into "id" so that it is backwards compatible.
                    const localInstance = activeInstances.find(i => i._id === coordinator.instance.id)
                    console.log('[YXCCRE] YanuX Coordinator Manual Component Distribution:', activeInstances)
                    console.log('[YXCCRE] Local Instance:', localInstance)
                    if (localInstance && localInstance.componentsDistribution && localInstance.componentsDistribution.components) {
                        this.props.configureComponents(localInstance.componentsDistribution.components)
                    }
                    this.props.instanceComponentsDistributed(activeInstances)
                } else if (componentsRuleEngine && coordinator.instance && coordinator.instance.id) {
                    this._distributeComponents(coordinator.instance.id, activeInstances)
                }
            }).catch(err => console.error('[YXCCRE] Error getting active instances', err));
        }
    }

    _distributeComponents(instanceId, activeInstances, ignoreManual = false) {
        const coordinator = this.props.coordinator
        const componentsRuleEngine = this.props.componentsRuleEngine
        if (coordinator && componentsRuleEngine) {
            componentsRuleEngine.proxemics = coordinator.proxemics.state
            componentsRuleEngine.instances = activeInstances
            componentsRuleEngine.run(ignoreManual)
                .then(res => {
                    console.log('[YXCCRE] YanuX Coordinator Components Rule Engine')
                    console.log('[YXCCRE] Instance Id', instanceId)
                    console.log('[YXCCRE] Proxemics:', componentsRuleEngine.proxemics)
                    console.log('[YXCCRE] Instances:', componentsRuleEngine.instances)
                    console.log('[YXCCRE] Result:', res)
                    if (coordinator.instance && coordinator.instance.id === instanceId) {
                        this.props.configureComponents(res.componentsConfig)
                    }
                    return coordinator.setComponentDistribution(res.componentsConfig, res.auto, instanceId)
                }).then(() => {
                    return coordinator.getActiveInstances()
                }).then(activeInstances => {
                    this.props.instanceComponentsDistributed(activeInstances)
                }).catch(err => console.error('[YXCCRE] Error:', err))
        }
    }

    resourcesSubscriptionHandler(data, eventType) {
        console.log(
            '[YXC] Resources Subscriber Handler Data:', data,
            'Event Type:', eventType
        )
        this.updateResources()
    }

    resourceSubscriptionHandler(data, eventType) {
        console.log(
            '[YXC] Resource Subscriber Handler Data:', data,
            'Event Type:', eventType
        )
        this.updateState(data)
    }

    proxemicsSubscriptionHandler(data, eventType) {
        console.log(
            '[YXC] Proxemics Subscriber Handler Data:', data,
            'Event Type:', eventType
        )
        this.updateComponents()
    }

    instancesSubscriptionHandler(data, eventType) {
        console.log(
            '[YXC] Instances Subscription Handler Data:', data,
            'Event Type:', eventType
        )
        this.updateComponents(data)
    }

    eventsSubcriptionHandler(data, eventType) {
        console.log(
            '[YXC] Events Subscription Handler Data:', data,
            'Event Type:', eventType
        )
    }

    reconnectSubscriptionHandler(state, proxemics) {
        console.log(
            '[YXC] Reconnect Subscription Handler State:', state,
            'Proxemics:', proxemics
        )
        this.updateState(state)
    }

    resourceSelected(e) {
        console.log('[YXRME] Resource Selected:', e.detail)
        const coordinator = this.props.coordinator
        const resourceId = e.detail.selectedResourceId;
        coordinator.getResourceData(resourceId).then(data => {
            console.log('[YXRME] Resource Id', resourceId, 'Data:', data)
            this.props.setValues(data.expression, data.total)
            coordinator.subscribeResource(this.resourceSubscriptionHandler, resourceId)
        }).catch(err => {
            this.handleOpenModal('Error Selecting Resource', err.message)
            console.error('[YXRME] Error Selecting Resource:', err)
        })
    }

    createResource(e) {
        console.log('[YXRME] Create Resource:', e.detail)
        const coordinator = this.props.coordinator
        coordinator.createResource(e.detail.resourceName)
            .then(resource => {
                console.log('[YXRME] Resource Created:', resource)
            }).catch(err => {
                this.handleOpenModal('Error Creating Resource', err.message)
                console.error('[YXRME] Error Creating Resource:', err)
            })
    }

    shareResource(e) {
        console.log('[YXRME] Share Resource:', e.detail)
        const coordinator = this.props.coordinator
        coordinator.shareResource(e.detail.resourceId, e.detail.userEmail)
            .then(resource => {
                console.log('[YXRME] Resource Shared:', resource)
            }).catch(err => {
                this.handleOpenModal('Error Sharing Resource', err.message)
                console.error('[YXRME] Error Sharing Resource:', err)
            })
    }

    deleteResource(e) {
        console.log('[YXRME] Delete Resource:', e.detail)
        const coordinator = this.props.coordinator
        coordinator.deleteResource(e.detail.resourceId)
            .then(resource => {
                console.log('[YXRME] Resource Deleted:', resource)
            }).catch(err => {
                this.handleOpenModal('Error Deleting Resource', err.message)
                console.error('[YXRME] Error Deleting Resource:', err)
            })
    }

    updatedComponentsDistribution(e) {
        const coordinator = this.props.coordinator
        console.log('[YXCDE] Updated Components Distribution:', e.detail)
        const componentsDistribution = e && e.detail && e.detail.componentsDistribution ? e.detail.componentsDistribution : null
        if (coordinator && componentsDistribution) {
            Promise.all(Object.keys(componentsDistribution)
                .map(instanceId => coordinator.setComponentDistribution(
                    componentsDistribution[instanceId].components,
                    componentsDistribution[instanceId].auto,
                    instanceId
                ))
            ).then(results => {
                console.log('[YXCDE] Updated Instances Based on the New Components Distribution:', results)
            }).catch(e => {
                console.log('[YXCDE] Something went wrong while updating Instances based on the new Components Distribution:', e)
            })
        }

    }

    resetAutoComponentsDistribution(e) {
        const coordinator = this.props.coordinator
        coordinator.getActiveInstances().then(activeInstances => {
            this._distributeComponents(e.detail.instanceId, activeInstances, true)
        }).catch(err => console.error('[YXCDE] Error while getting active instances:', err));
        console.log('[YXCDE] Reset Auto Components Distribution:', e.detail)
    }
}