"""LangGraph Orchestration workflow definition for ARC."""
from langgraph.graph import StateGraph, END
from app.graph.state import ElderState
from app.graph.nodes import (
    node_intent_extractor,
    node_router,
    node_medicine_agent,
    node_emergency_agent,
    node_caregiver_agent,
    node_health_agent,
    node_government_agent,
    node_confirmation_agent,
)


def build_elder_graph():
    """Builds and compiles the StateGraph workflow."""
    workflow = StateGraph(ElderState)

    # 1. Add Nodes
    workflow.add_node("intent_extractor", node_intent_extractor)
    workflow.add_node("medicine_node", node_medicine_agent)
    workflow.add_node("emergency_node", node_emergency_agent)
    workflow.add_node("caregiver_node", node_caregiver_agent)
    workflow.add_node("health_node", node_health_agent)
    workflow.add_node("government_node", node_government_agent)
    workflow.add_node("confirmation_node", node_confirmation_agent)

    # 2. Set Entry Point
    workflow.set_entry_point("intent_extractor")

    # 3. Add Conditional Routing from Intent Extractor to domain nodes
    workflow.add_conditional_edges(
        "intent_extractor",
        node_router,
        {
            "medicine_node": "medicine_node",
            "emergency_node": "emergency_node",
            "caregiver_node": "caregiver_node",
            "health_node": "health_node",
            "government_node": "government_node",
            "confirmation_node": "confirmation_node",
        },
    )

    # 4. Connect domain nodes to confirmation node
    workflow.add_edge("medicine_node", "confirmation_node")
    workflow.add_edge("emergency_node", "confirmation_node")
    workflow.add_edge("caregiver_node", "confirmation_node")
    workflow.add_edge("health_node", "confirmation_node")
    workflow.add_edge("government_node", "confirmation_node")

    # 5. Exit from confirmation node
    workflow.add_edge("confirmation_node", END)

    return workflow.compile()


elder_orchestration_graph = build_elder_graph()
